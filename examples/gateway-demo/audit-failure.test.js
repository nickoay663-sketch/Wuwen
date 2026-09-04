import test from 'node:test';
import assert from 'node:assert/strict';

import {
  auditLedger,
  startServer,
  stopServer,
  cleanupLedger
} from './server.js';

const VALID_PAYLOAD = {
  eventId: 'evt-audit-failure-contract-001',
  expression: '探索性假说：未被完全解析的深空信号',
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
  limitations: ['Requires further calibration'],
  responsibility: {
    subject: 'Astrophysics',
    scope: 'Deep Space',
    basis: 'Anomalous radio signals',
    limitations: ['Requires further calibration']
  }
};

test('Gateway fails closed when audit persistence fails', async () => {
  auditLedger.append = () => {
    throw new Error('AUDIT_WRITE_FAILURE_TEST');
  };

  let port;

  try {
    port = await startServer(0);

    const response = await fetch(
      `http://127.0.0.1:${port}/api/action`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Id': 'req-audit-failure-contract'
        },
        body: JSON.stringify(VALID_PAYLOAD)
      }
    );

    const body = await response.json();

    assert.strictEqual(
      response.status,
      503,
      'Audit persistence failure must return HTTP 503.'
    );

    assert.strictEqual(
      body.status,
      'AUDIT_FAILURE'
    );

    assert.strictEqual(
      body.reason,
      'AUDIT_PERSISTENCE_FAILURE'
    );
  } finally {
    await stopServer();
    cleanupLedger();
  }
});
