import { WuwenTrustGateway } from './src/index.js';
import { WALContract } from '@wuwen/core';

async function runGatewayFinalAcceptance() {
  console.log('=== [MoWen Gateway] 最终集成验收 ===\n');

  const perfectEnvelope = {
    eventId: 'evt_' + Date.now(),
    expression: { action: 'INIT', actor: 'system' },
    identity: 'node_runtime_identity_sig',
    timestamp: Date.now(),
    verificationState: WALContract.VERIFICATION_STATES.VERIFIED,
    responsibilityState: WALContract.RESPONSIBILITY_STATES.ESTABLISHED,
    propagationState: WALContract.PROPAGATION_STATES.ALLOW,
    runtimeVersion: '10.8',
    contractVersion: WALContract.VERSION,
    evidence: [{ id: 'ev_1', type: 'SYSTEM_BOOT' }],
    signature: 'mock_valid_signature_sha256',
    correspondence: false,
    nonCorrespondence: false,
    responsibility: null
  };

  const res = WuwenTrustGateway.evaluateSubmission(perfectEnvelope);
  console.log('[网关最终裁决结果]:', {
    accepted: res.accepted,
    status: res.verdict?.status,
    passedRules: res.verdict?.passedRules,
    totalRules: res.verdict?.totalRulesChecked,
    failedRulesCount: res.verdict?.failedRules?.length
  });
}

runGatewayFinalAcceptance();
