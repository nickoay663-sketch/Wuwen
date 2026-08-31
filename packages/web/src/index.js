// @wuwen/web Adapter: Bridging WAL Protocol Core to Browser / Web environments
export * from '@wuwen/core';

import { WALContract, WALIndependentValidator } from '@wuwen/core';

export class BrowserWALSession {
  constructor(authorIdentityHash) {
    this.authorIdentityHash = authorIdentityHash;
    this.contract = new WALContract({ authorIdentityHash });
  }

  appendRecord(content, epistemicState = 'FACT') {
    return this.contract.createRecord(content, epistemicState);
  }

  getLedgerChain() {
    return this.contract.getChain();
  }

  static verifyExternalChain(chain) {
    return WALIndependentValidator.validate(chain);
  }
}
