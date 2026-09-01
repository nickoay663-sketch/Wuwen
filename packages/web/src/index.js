// @wuwen/web Adapter: Bridging WAL Protocol Core to Browser / Web environments
export * from '@wuwen/core';

import {
  WALContract,
  WALIndependentValidator,
  WALResponsibilityInterface
} from '@wuwen/core';

export class BrowserWALSession {
  constructor(authorIdentityHash) {
    this.authorIdentityHash = authorIdentityHash;
    this.records = [];
  }

  appendRecord(content, epistemicState = 'UNKNOWN') {
    const event = {
      eventId: `web_${Date.now()}`,
      expression: content,
      timestamp: new Date().toISOString(),
      runtimeVersion: null,
      contractVersion: WALContract.VERSION,
      responsibilityRecords: [{
        id: `rec_${Date.now()}`,
        epistemicState,
        verificationStatus: WALContract.VERIFICATION_STATES.UNKNOWN,
        verifiedEvidenceCount: 0,
        canPublish: false,
        evidence: [],
        responsibilityActor: {
          identity: this.authorIdentityHash
        },
        expression: content
      }]
    };

    const envelope =
      WALResponsibilityInterface.fromResponsibilityEvent(event);

    this.records.push(envelope);

    return envelope;
  }

  getLedgerChain() {
    return Object.freeze([...this.records]);
  }

  static verifyExternalChain(chain) {
    return new WALIndependentValidator().validateEnvelope(chain);
  }
}
