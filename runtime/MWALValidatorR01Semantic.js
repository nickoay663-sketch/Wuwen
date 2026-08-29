export default class MWALValidatorR01Semantic {
    static validateR01_04(envelope) {
        if (!envelope.claim || !Array.isArray(envelope.evidence)) {
            return { rule: "MWAL-R01-04", passed: true };
        }

        const claimText = typeof envelope.claim === "string" ? envelope.claim : (envelope.claim.text || "");
        const evidenceSnippets = envelope.evidence.map(e => e.snippet || "").join(" ");

        const ungroundedKeywords = ["definitely guarantees", "unconditionally proves", "absolute certainty without data"];
        for (const keyword of ungroundedKeywords) {
            if (claimText.toLowerCase().includes(keyword) && !evidenceSnippets.toLowerCase().includes(keyword)) {
                return {
                    rule: "MWAL-R01-04",
                    passed: false,
                    reason: `Semantic boundary violated [MWAL-R01-04]: Claim introduces ungrounded absolute term '${keyword}' absent from evidence.`
                };
            }
        }
        return { rule: "MWAL-R01-04", passed: true };
    }

    static validateR01_06(envelope) {
        if (envelope.epistemicState === "CERTAIN" && envelope.rhetoricalTone === "SPECULATIVE") {
            return {
                rule: "MWAL-R01-06",
                passed: false,
                reason: "Rhetorical boundary violated [MWAL-R01-06]: Speculative tone cannot coexist with CERTAIN epistemic state."
            };
        }
        return { rule: "MWAL-R01-06", passed: true };
    }

    static validateAll(envelope) {
        const checks = [
            this.validateR01_04(envelope),
            this.validateR01_06(envelope)
        ];
        const failures = checks.filter(c => !c.passed);
        return {
            success: failures.length === 0,
            failures: failures
        };
    }
}
