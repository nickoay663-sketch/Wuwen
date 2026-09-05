import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  auditLedger,
  ledgerPath,
  startServer,
  stopServer,
  cleanupLedger,
  resetIntegrityFailureLock
} from './server.js';

async function post(port, payload, requestId) {
  return fetch(`http://127.0.0.1:${port}/api/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-request-id': requestId
    },
    body: JSON.stringify(payload)
  });
}

function conformPayload() {
  return {
    eventId: `conformance-${Date.now()}`,
    expression: 'Exploratory hypothesis about an unresolved signal',
    identity: 'conformance-client',
    timestamp: Date.now(),
    verificationState: 'UNVERIFIED',
    responsibilityState: 'UNKNOWN',
    propagationState: 'ALLOW_WITH_BOUNDARY',
    runtimeVersion: '10.8.3',
    contractVersion: '1.0',
    subject: 'Conformance',
    scope: 'Test',
    basis: 'Unresolved observation',
    limitations: [
      'Requires further verification'
    ],
    responsibility: {
      subject: 'Conformance',
      scope: 'Test',
      basis: 'Unresolved observation',
      limitations: [
        'Requires further verification'
      ]
    }
  };
}

test('WAL Gateway Conformance: integrity failure rejects the request', { concurrency: false }, async () => {
  cleanupLedger();
  resetIntegrityFailureLock();

  const port = await startServer(0);

  try {
    const firstResponse = await post(
      port,
      conformPayload(),
      'conformance-integrity-1'
    );

    assert.equal(firstResponse.status, 200);
    assert.equal(auditLedger.verifyIntegrity().valid, true);

    const lines = fs.readFileSync(ledgerPath, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean);

    const record = JSON.parse(lines[0]);
    record.decision = 'BLOCK';

    fs.writeFileSync(
      ledgerPath,
      JSON.stringify(record) + '\n',
      'utf8'
    );

    const response = await post(
      port,
      conformPayload(),
      'conformance-integrity-2'
    );

    assert.equal(response.status, 500);

    const body = await response.json();

    assert.equal(body.decision, 'BLOCK');
    assert.equal(body.status, 'AUDIT_FAILURE');
    assert.equal(body.reason, 'AUDIT_LEDGER_INTEGRITY_FAILURE');
    assert.equal(body.locked, true);

    const subsequent = await post(
      port,
      conformPayload(),
      'conformance-integrity-3'
    );

    assert.equal(subsequent.status, 503);

    const subsequentBody = await subsequent.json();

    assert.equal(subsequentBody.decision, 'BLOCK');
    assert.equal(subsequentBody.status, 'AUDIT_FAILURE');
    assert.equal(
      subsequentBody.reason,
      'AUDIT_LEDGER_INTEGRITY_FAILURE'
    );
    assert.equal(subsequentBody.locked, true);
  } finally {
    await stopServer();
    cleanupLedger();
    resetIntegrityFailureLock();
  }
});

test('WAL Gateway Conformance: tampered audit record cannot produce ALLOW', { concurrency: false }, async () => {
  cleanupLedger();
  resetIntegrityFailureLock();

  const port = await startServer(0);

  try {
    const firstResponse = await post(
      port,
      conformPayload(),
      'conformance-tamper-1'
    );

    assert.equal(firstResponse.status, 200);

    const lines = fs.readFileSync(ledgerPath, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean);

    const record = JSON.parse(lines[0]);
    record.requestId = 'forged-request-id';

    fs.writeFileSync(
      ledgerPath,
      JSON.stringify(record) + '\n',
      'utf8'
    );

    const response = await post(
      port,
      conformPayload(),
      'conformance-tamper-2'
    );

    assert.equal(response.status, 500);

    const body = await response.json();

    assert.equal(body.decision, 'BLOCK');
    assert.equal(body.status, 'AUDIT_FAILURE');
    assert.equal(
      body.reason,
      'AUDIT_LEDGER_INTEGRITY_FAILURE'
    );
    assert.equal(body.locked, true);

    const subsequent = await post(
      port,
      conformPayload(),
      'conformance-tamper-3'
    );

    assert.equal(subsequent.status, 503);

    const subsequentBody = await subsequent.json();

    assert.equal(subsequentBody.decision, 'BLOCK');
    assert.equal(subsequentBody.locked, true);
  } finally {
    await stopServer();
    cleanupLedger();
    resetIntegrityFailureLock();
  }
});

test('WAL Gateway Conformance: forged governance fields cannot bypass the validator', { concurrency: false }, async () => {
  cleanupLedger();
  resetIntegrityFailureLock();

  const port = await startServer(0);

  try {
    const forgedPayload = {
      ...conformPayload(),
      eventId: 'conformance-bypass-1',
      expression: 'Absolute verified certainty without evidence',
      decision: 'ALLOW',
      validatorStatus: 'CONFORM',
      passed: true,
      supported: true,
      verificationStatus: 'VERIFIED',
      responsibilityState: 'TRUE',
      propagationState: 'GLOBAL',
            responsibility: {
        subject: 'Conformance',
        scope: 'Test',
        basis: 'None',
        limitations: []
      }
    };

    // 注意：以下 422/BLOCK 由 verificationState:'VERIFIED' 缺少 evidence 数组触发（WAL-R00-03），
    // 而非验证器分析 expression 文本内容——当前实现中 expression 内容本身不被语义审查。
    const response = await post(
      port,
      forgedPayload,
      'conformance-bypass-1'
    );

    assert.equal(response.status, 422);

    const body = await response.json();

    assert.equal(body.decision, 'BLOCK');
    assert.equal(body.validatorStatus, 'NON_CONFORM');
    assert.ok(body.failedRules.length > 0);
    assert.equal(body.auditRecorded, true);

    const integrity = auditLedger.verifyIntegrity();

    assert.equal(integrity.valid, true);
    assert.equal(integrity.totalRecords, 1);
  } finally {
    await stopServer();
    cleanupLedger();
    resetIntegrityFailureLock();
  }
});
