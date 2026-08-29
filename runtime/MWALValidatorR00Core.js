export default class MWALValidatorR00Core {
    static validateR00_02(envelope) {
        const hasEvidence = Array.isArray(envelope.evidence) && envelope.evidence.length > 0;
        const assumedResponsibility = envelope.responsibility || envelope.epistemicState;
        if ((assumedResponsibility === 'ESTABLISHED' || assumedResponsibility === 'CERTAIN') && !hasEvidence) {
            return {
                rule: 'MWAL-R00-02',
                passed: false,
                reason: 'Evidence adequacy violated: High responsibility assumed without supporting evidence.'
            };
        }
        return { rule: 'MWAL-R00-02', passed: true };
    }

    static validateR00_03(envelope) {
        const state = envelope.epistemicState || envelope.verificationStatus;
        if (state === 'CERTAIN' && (!envelope.evidence || envelope.evidence.length === 0)) {
            return {
                rule: 'MWAL-R00-03',
                passed: false,
                reason: 'Unsupported certainty detected: Pipeline closure attempted without backing evidence.'
            };
        }
        return { rule: 'MWAL-R00-03', passed: true };
    }

    static validateR00_04(envelope) {
        if (Array.isArray(envelope.evidence)) {
            for (const ev of envelope.evidence) {
                if (!ev.source || (typeof ev.snippet === 'string' && ev.snippet.includes('MANUFACTURED_PLACEHOLDER'))) {
                    return {
                        rule: 'MWAL-R00-04',
                        passed: false,
                        reason: 'Manufactured evidence detected from source: ' + (ev.source || 'unknown')
                    };
                }
            }
        }
        return { rule: 'MWAL-R00-04', passed: true };
    }

    static validateR00_05(envelope) {
        const claim = envelope.claim || envelope.subject;
        if (typeof claim === 'string' && claim.includes('SYNTHETIC_FABRICATION_MARKER')) {
            return {
                rule: 'MWAL-R00-05',
                passed: false,
                reason: 'Knowledge fabrication detected: Claim relies on synthetic ungrounded generation.'
            };
        }
        return { rule: 'MWAL-R00-05', passed: true };
    }

    static validateAll(envelope) {
        const checks = [
            this.validateR00_02(envelope),
            this.validateR00_03(envelope),
            this.validateR00_04(envelope),
            this.validateR00_05(envelope)
        ];
        const failures = checks.filter(c => !c.passed);
        return {
            success: failures.length === 0,
            failures: failures
        };
    }
}

