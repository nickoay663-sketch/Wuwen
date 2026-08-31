import { WALIndependentValidator } from '@wuwen/core';

const validator = new WALIndependentValidator();

export class WuwenTrustGateway {
  static evaluateSubmission(signedChain) {
    const verdict = validator.validateEnvelope(signedChain);
    return { gatewayTimestamp: Date.now(), accepted: verdict.passed, verdict };
  }
}

