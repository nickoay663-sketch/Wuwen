import WALValidatorR00Core from './WALValidatorR00Core.js';
import WALValidatorR01Semantic from './WALValidatorR01Semantic.js';

export default class WALGatekeeper {
    static inspect(envelope) {
        if (!envelope) {
            return {
                admitted: false,
                reason: 'Gatekeeper rejection: Null or undefined envelope received.'
            };
        }

        // Phase 1: Core Invariants
        const coreValidation = WALValidatorR00Core.validateAll(envelope);
        if (!coreValidation.success) {
            return {
                admitted: false,
                reason: 'Pre-ledger compliance failure: Core invariants violated.',
                violations: coreValidation.failures
            };
        }

        // Phase 2: Semantic & Rhetorical Boundaries
        const semanticValidation = WALValidatorR01Semantic.validateAll(envelope);
        if (!semanticValidation.success) {
            return {
                admitted: false,
                reason: 'Pre-ledger compliance failure: Semantic and rhetorical boundaries violated.',
                violations: semanticValidation.failures
            };
        }

        return {
            admitted: true,
            reason: 'Envelope passed all Phase 1 and Phase 2 gatekeeper checks.'
        };
    }
}
