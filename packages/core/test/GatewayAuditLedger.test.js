import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';

import GatewayAuditEvent from '../src/GatewayAuditEvent.js';
import GatewayAuditLedger from '../src/GatewayAuditLedger.js';

function createEvent(id, requestId, decision = 'BLOCK') {
    return GatewayAuditEvent.create({
        id,
        eventType: decision === 'BLOCK'
            ? 'RESPONSIBILITY_BREACH'
            : 'RESPONSIBILITY_CONFORM',
        source: 'express-gateway',
        decision,
        responsibilityState: 'CONFORM',
        verificationState: 'VERIFIED',
        propagationState: 'ALLOW_WITH_BOUNDARY',
        failedRules: decision === 'BLOCK'
            ? ['R00-03', 'R02-14']
            : [],
        requestId,
        timestamp: '2026-09-04T00:00:00.000Z'
    });
}

test('GatewayAuditLedger persists all core governance fields and maintains cryptographic integrity', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wuwen-gateway-audit-'));
    const ledgerPath = path.join(tempDir, 'gateway-audit.jsonl');

    try {
        const ledger = new GatewayAuditLedger(ledgerPath);
        const event = createEvent('audit_001', 'evt-http-001', 'ALLOW');

        const stored = ledger.append(event);

        assert.equal(stored.id, 'audit_001');
        assert.equal(stored.verificationState, 'VERIFIED');
        assert.equal(stored.propagationState, 'ALLOW_WITH_BOUNDARY');
        assert.equal(stored.responsibilityState, 'CONFORM');

        const lines = fs.readFileSync(ledgerPath, 'utf8').trim().split('\n');
        assert.equal(lines.length, 1);

        const persisted = JSON.parse(lines[0]);
        assert.equal(persisted.verificationState, 'VERIFIED');
        assert.equal(persisted.propagationState, 'ALLOW_WITH_BOUNDARY');

        assert.deepEqual(
            ledger.verifyIntegrity(),
            { valid: true, totalRecords: 1 }
        );
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test('GatewayAuditLedger detects value tampering on verificationState and propagationState', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wuwen-gateway-audit-tamper-'));
    const ledgerPath = path.join(tempDir, 'gateway-audit.jsonl');

    try {
        const ledger = new GatewayAuditLedger(ledgerPath);
        ledger.append(createEvent('audit_002', 'evt-http-002', 'ALLOW'));

        const lines = fs.readFileSync(ledgerPath, 'utf8').trim().split('\n');
        const record = JSON.parse(lines[0]);

        assert.equal(record.verificationState, 'VERIFIED');
        assert.equal(record.propagationState, 'ALLOW_WITH_BOUNDARY');

        // 篡改测试 1：修改 verificationState
        const tampered1 = { ...record, verificationState: 'UNVERIFIED' };
        lines[0] = JSON.stringify(tampered1);
        fs.writeFileSync(ledgerPath, lines.join('\n') + '\n', 'utf8');

        let result = ledger.verifyIntegrity();
        assert.equal(result.valid, false);
        assert.match(result.error, /Signature mismatch/i);

        // 篡改测试 2：修改 propagationState（重新写入合法的原始记录再篡改）
        const freshLedger = new GatewayAuditLedger(ledgerPath);
        // 清空并重新 append 一条合法的
        fs.writeFileSync(ledgerPath, '', 'utf8');
        freshLedger.append(createEvent('audit_002', 'evt-http-002', 'ALLOW'));
        
        const freshLines = fs.readFileSync(ledgerPath, 'utf8').trim().split('\n');
        const freshRecord = JSON.parse(freshLines[0]);
        
        const tampered2 = { ...freshRecord, propagationState: 'BLOCK' };
        freshLines[0] = JSON.stringify(tampered2);
        fs.writeFileSync(ledgerPath, freshLines.join('\n') + '\n', 'utf8');

        result = freshLedger.verifyIntegrity();
        assert.equal(result.valid, false);
        assert.match(result.error, /Signature mismatch/i);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
