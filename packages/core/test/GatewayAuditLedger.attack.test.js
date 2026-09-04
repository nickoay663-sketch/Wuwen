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
        source: 'express-gateway',
        decision,
        responsibilityState: 'UNKNOWN',
        verificationStatus: 'UNVERIFIED',
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
    ['verificationStatus', 'VERIFIED'],
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

        record.failedRules = ['R04-01'];

        lines[0] = JSON.stringify(record);
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /Signature mismatch|chain broken/i);
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});

test('Ledger blocks tampering of previousHash', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        const record = JSON.parse(lines[1]);

        record.previousHash = 'forged-previous-hash';

        lines[1] = JSON.stringify(record);
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /chain broken/i);
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});

test('Ledger blocks tampering of signature', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);
        const record = JSON.parse(lines[0]);

        record.signature = '0'.repeat(64);

        lines[0] = JSON.stringify(record);
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /Signature mismatch|chain broken/i);
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});

test('Ledger blocks deletion of an intermediate record', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);

        lines.splice(0, 1);
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /chain broken/i);
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});

test('Ledger blocks appended forged records', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);

        const forged = JSON.parse(lines[1]);

        forged.id = 'audit_forged_999';
        forged.requestId = 'evt-forged-999';

        lines.push(JSON.stringify(forged));
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /chain broken|Signature mismatch/i);
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});

test('Ledger blocks malformed JSON', () => {
    const { tempDir, ledgerPath, ledger } = createLedger();

    try {
        const lines = readLines(ledgerPath);

        lines[0] = '{this-is-not-valid-json';
        writeLines(ledgerPath, lines);

        const result = ledger.verifyIntegrity();

        assert.equal(result.valid, false);
        assert.match(result.error, /Invalid JSON/i);
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});

test('Untampered multi-record ledger remains valid', () => {
    const { tempDir, ledger } = createLedger();

    try {
        assert.deepEqual(
            ledger.verifyIntegrity(),
            {
                valid: true,
                totalRecords: 2
            }
        );
    } finally {
        fs.rmSync(tempDir, {
            recursive: true,
            force: true
        });
    }
});
