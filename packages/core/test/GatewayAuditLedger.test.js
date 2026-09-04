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
        responsibilityState: 'UNKNOWN',
        verificationStatus: 'UNVERIFIED',
        failedRules: decision === 'BLOCK'
            ? ['R00-03', 'R02-14']
            : [],
        requestId,
        timestamp: '2026-09-04T00:00:00.000Z'
    });
}

test('GatewayAuditLedger persists audit events without using WAL Evidence', () => {
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'wuwen-gateway-audit-')
    );

    const ledgerPath = path.join(tempDir, 'gateway-audit.jsonl');

    try {
        const ledger = new GatewayAuditLedger(ledgerPath);
        const event = createEvent(
            'audit_001',
            'evt-http-001'
        );

        const stored = ledger.append(event);

        assert.equal(stored.id, 'audit_001');
        assert.equal(stored.eventType, 'RESPONSIBILITY_BREACH');
        assert.equal(stored.decision, 'BLOCK');

        assert.equal(
            Object.prototype.hasOwnProperty.call(stored, 'evidence'),
            false
        );

        assert.equal(
            Object.prototype.hasOwnProperty.call(stored, 'evidenceHash'),
            false
        );

        const lines = fs.readFileSync(ledgerPath, 'utf8')
            .trim()
            .split('\n');

        assert.equal(lines.length, 1);

        const persisted = JSON.parse(lines[0]);

        assert.equal(persisted.id, 'audit_001');
        assert.equal(persisted.previousHash, 'genesis_Wuwen_gateway_audit');
        assert.equal(typeof persisted.signature, 'string');
        assert.equal(persisted.signature.length, 64);

        assert.deepEqual(
            ledger.verifyIntegrity(),
            {
                valid: true,
                totalRecords: 1
            }
        );
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});

test('GatewayAuditLedger detects tampering of a persisted audit event', () => {
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'wuwen-gateway-audit-tamper-')
    );

    const ledgerPath = path.join(tempDir, 'gateway-audit.jsonl');

    try {
        const ledger = new GatewayAuditLedger(ledgerPath);

        ledger.append(
            createEvent('audit_002', 'evt-http-002')
        );

        const second = ledger.append(
            createEvent('audit_003', 'evt-http-003', 'ALLOW')
        );

        assert.equal(
            ledger.verifyIntegrity().valid,
            true
        );

        const lines = fs.readFileSync(ledgerPath, 'utf8')
            .trim()
            .split('\n');

        const tampered = JSON.parse(lines[0]);
        tampered.decision = 'ALLOW';

        lines[0] = JSON.stringify(tampered);

        fs.writeFileSync(
            ledgerPath,
            lines.join('\n') + '\n',
            'utf8'
        );

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(
            result.error,
            /Signature mismatch|chain broken/i
        );

        // Keep the second record variable exercised so this test also
        // confirms that the ledger created a chained second event.
        assert.equal(second.previousHash, tampered.signature);
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});
