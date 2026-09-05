import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';

import GatewayAuditEvent from '../src/GatewayAuditEvent.js';
import GatewayAuditLedger from '../src/GatewayAuditLedger.js';

function createEvent(
    id,
    requestId,
    decision = 'BLOCK',
    failedRules = ['R00-03']
) {
    return GatewayAuditEvent.create({
        id,
        eventType: decision === 'BLOCK'
            ? 'RESPONSIBILITY_BREACH'
            : 'RESPONSIBILITY_CONFORM',
        decision,
        responsibilityState: 'UNKNOWN',
        verificationState: 'UNVERIFIED',
        propagationState: 'ALLOW',
        failedRules,
        requestId,
        timestamp: '2026-09-04T00:00:00.000Z'
    });
}

function createLedger() {
    const tempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'wuwen-gateway-audit-attack-')
    );

    const ledgerPath = path.join(
        tempDir,
        'gateway-audit.jsonl'
    );

    const ledger = new GatewayAuditLedger(ledgerPath);

    ledger.append(
        createEvent(
            'audit_attack_001',
            'evt-attack-001'
        )
    );

    ledger.append(
        createEvent(
            'audit_attack_002',
            'evt-attack-002',
            'ALLOW',
            []
        )
    );

    return {
        tempDir,
        ledgerPath,
        ledger
    };
}

function readLines(ledgerPath) {
    return fs.readFileSync(ledgerPath, 'utf8')
        .trim()
        .split('\n');
}

function writeLines(ledgerPath, lines) {
    fs.writeFileSync(
        ledgerPath,
        lines.join('\n') + '\n',
        'utf8'
    );
}

const fieldAttacks = [
    ['decision', 'ALLOW'],
    ['responsibilityState', 'ESTABLISHED'],
    ['verificationState', 'VERIFIED'],
    ['propagationState', 'BLOCK'],
    ['requestId', 'forged-request'],
    ['timestamp', '2099-01-01T00:00:00.000Z']
];

for (const [field, value] of fieldAttacks) {
    test(`Ledger blocks tampering of ${field}`, () => {
        const { tempDir, ledgerPath, ledger } = createLedger();

        try {
            const lines = readLines(ledgerPath);
            const record = JSON.parse(lines[0]);

            record[field] = value;
            lines[0] = JSON.stringify(record);
            writeLines(ledgerPath, lines);

            const result = ledger.verifyIntegrity();

            assert.equal(result.valid, false);
            assert.match(
                result.error,
                /Signature mismatch|chain broken/i
            );
        } finally {
            fs.rmSync(tempDir, {
                recursive: true,
                force: true
            });
        }
    });
}

test('Ledger blocks tampering of failedRules', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        const record = JSON.parse(lines[0]);

        record.failedRules = ['R99-99'];
        lines[0] = JSON.stringify(record);
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /Signature mismatch/i);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test('Ledger blocks tampering of previousHash', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        const record = JSON.parse(lines[1]);

        record.previousHash = 'forged_previous_hash';
        lines[1] = JSON.stringify(record);
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /chain broken/i);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test('Ledger blocks tampering of signature', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        const record = JSON.parse(lines[0]);

        record.signature = 'forged_signature_hex';
        lines[0] = JSON.stringify(record);
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /Signature mismatch/i);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test('Ledger blocks deletion of an intermediate record', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        writeLines(ledgerPath, [lines[1]]);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /chain broken/i);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test('Ledger blocks appended record with correct linkage but tampered content', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        const lastRecord = JSON.parse(lines[lines.length - 1]);
        
        // 构造一条新记录：正确衔接上一条的 signature，但暗中篡改内容且不重算签名
        const forgedRecord = {
            ...lastRecord,
            id: 'audit_attack_forged',
            previousHash: lastRecord.signature,
            decision: 'BLOCK', // 改动内容
            timestamp: '2026-09-04T01:00:00.000Z'
        };

        lines.push(JSON.stringify(forgedRecord));
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        // 此处必须精确命中 Signature mismatch，证明指针合法情况下的内容篡改防护层独立生效
        assert.match(result.error, /Signature mismatch/i);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test('Ledger blocks malformed JSON', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        lines[0] = '{malformed-json}';
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /Invalid JSON/i);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});

test('Untampered multi-record ledger remains valid', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const result = ledger.verifyIntegrity();
        assert.equal(result.valid, true);
        assert.equal(result.totalRecords, 2);
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
