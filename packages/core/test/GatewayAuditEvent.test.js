import test from 'node:test';
import assert from 'node:assert';
import GatewayAuditEvent from '../src/GatewayAuditEvent.js';

test('GatewayAuditEvent initializes and serializes correctly with exact field contract', () => {
  const event = new GatewayAuditEvent({
    decision: 'ALLOW',
    responsibilityState: 'UNKNOWN',
    verificationState: 'UNVERIFIED',
    propagationState: 'ALLOW_WITH_BOUNDARY',
    requestId: 'req-123',
    failedRules: []
  });

  const json = event.toJSON();
  assert.strictEqual(json.decision, 'ALLOW');
  assert.strictEqual(json.responsibilityState, 'UNKNOWN');
  assert.strictEqual(json.verificationState, 'UNVERIFIED');
  assert.strictEqual(json.propagationState, 'ALLOW_WITH_BOUNDARY');
  assert.strictEqual(json.requestId, 'req-123');
  assert.deepStrictEqual(json.failedRules, []);
  assert.ok(json.timestamp);
});
