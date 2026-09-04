import test from 'node:test';
import assert from 'node:assert';

import fs from 'node:fs';

import {
  server,
  auditLedger,
  ledgerPath,
  startServer,
  stopServer,
  cleanupLedger
} from './server.js';

test('Gateway middleware records WAL decisions and maintains tamper-evident chain', async () => {
  cleanupLedger();

  const port = await startServer(0);

  try {
    const validPayload = {
      eventId: 'evt-http-001',
      expression:
        '探索性假说：未被完全解析的深空信号',
      identity: 'astronomer-01',
      timestamp: Date.now(),
      verificationState: 'UNVERIFIED',
      responsibilityState: 'UNKNOWN',
      propagationState: 'ALLOW_WITH_BOUNDARY',
      runtimeVersion: '10.8.3',
      contractVersion: '1.0',
      subject: 'Astrophysics',
      scope: 'Deep Space',
      basis: 'Anomalous radio signals',
      limitations: [
        'Requires further calibration'
      ],
      responsibility: {
        subject: 'Astrophysics',
        scope: 'Deep Space',
        basis: 'Anomalous radio signals',
        limitations: [
          'Requires further calibration'
        ]
      }
    };

    const response1 = await fetch(
      `http://127.0.0.1:${port}/api/action`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': 'req-test-1'
        },
        body: JSON.stringify(validPayload)
      }
    );

    const data1 = await response1.json();

    assert.strictEqual(response1.status, 200);
    assert.strictEqual(data1.decision, 'ALLOW');
    assert.strictEqual(data1.validatorStatus, 'CONFORM');
    assert.deepEqual(data1.failedRules, []);
    assert.strictEqual(data1.auditRecorded, true);
    assert.strictEqual(data1.ledgerHeight, 1);

    const invalidPayload = {
      eventId: 'evt-http-002',
      expression:
        '绝对确知的未经证实的断言',
      identity: 'dogmatist-01',
      timestamp: Date.now(),
      verificationState: 'VERIFIED',
      responsibilityState: 'TRUE',
      propagationState: 'GLOBAL',
      runtimeVersion: '10.8.3',
      contractVersion: '1.0',
      subject: 'Dogma',
      scope: 'Absolute',
      basis: 'None',
      limitations: [],
      responsibility: {
        basis: 'None'
      }
    };

    const response2 = await fetch(
      `http://127.0.0.1:${port}/api/action`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': 'req-test-2'
        },
        body: JSON.stringify(invalidPayload)
      }
    );

    const data2 = await response2.json();

    assert.strictEqual(response2.status, 422);
    assert.strictEqual(data2.decision, 'BLOCK');
    assert.strictEqual(data2.validatorStatus, 'NON_CONFORM');
    assert.ok(data2.failedRules.length > 0);
    assert.strictEqual(data2.auditRecorded, true);
    assert.strictEqual(data2.ledgerHeight, 2);

    const integrity = auditLedger.verifyIntegrity();

    assert.deepEqual(
      integrity,
      {
        valid: true,
        totalRecords: 2
      }
    );

    const lines = fs
      .readFileSync(ledgerPath, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean);

    const record0 = JSON.parse(lines[0]);
    const record1 = JSON.parse(lines[1]);

    assert.strictEqual(record0.decision, 'ALLOW');
    assert.strictEqual(record0.requestId, 'req-test-1');

    assert.strictEqual(record1.decision, 'BLOCK');
    assert.strictEqual(record1.requestId, 'req-test-2');

    assert.strictEqual(
      record1.previousHash,
      record0.signature
    );

    assert.notStrictEqual(
      record0.signature,
      record1.signature
    );
  } finally {
    await stopServer();
    cleanupLedger();
  }
});
