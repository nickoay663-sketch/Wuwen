class TestimonyValidator {
    constructor(snapshot) {
        if (typeof snapshot === "string") {
            try {
                this.data = JSON.parse(snapshot);
            } catch (e) {
                throw new Error("INVALID_JSON_INPUT: Failed to parse snapshot string");
            }
        } else {
            this.data = snapshot;
        }
    }

    validateAll() {
        const results = {
            structureCheck: this.checkStructure(),
            executionCheck: this.checkExecutionCompleteness(),
            purityCheck: this.checkPurityAndNonTampering(),
        };
        const passed = Object.values(results).every(r => r.passed);
        return {
            valid: passed,
            details: results
        };
    }

    checkStructure() {
        const requiredKeys = ["runtimeVersion", "runtimeTrace", "metadata"];
        const missing = requiredKeys.filter(k => !(k in this.data));
        return {
            passed: missing.length === 0,
            reason: missing.length === 0 ? "Structure intact (runtimeVersion, runtimeTrace, metadata found)" : `Missing keys: ${missing.join(", ")}`
        };
    }

    checkExecutionCompleteness() {
        const trace = Array.isArray(this.data.runtimeTrace) ? this.data.runtimeTrace : [];
        const engineKeys = [
            "recognition", "definition", "search", "evidence",
            "runtimeVerification", "correspondence", "reasoning",
            "reconstruction", "generator", "selfCheck"
        ];
        const detectedEngines = engineKeys.filter(k => k in this.data);
        const passed = trace.length > 0 && detectedEngines.length > 0;
        return {
            passed,
            traceCount: trace.length,
            engineOutputsFound: detectedEngines.length,
            reason: passed ? `Verified ${trace.length} trace items & ${detectedEngines.length} engine output blocks` : "Execution trace or engine results incomplete"
        };
    }

    checkPurityAndNonTampering() {
        try {
            const jsonString = JSON.stringify(this.data);
            const forbiddenKeys = ["runtimeContext", "languageAdapter", "engineRegistry"];
            const leakedKeys = forbiddenKeys.filter(k => jsonString.includes(`"${k}"`));
            return {
                passed: leakedKeys.length === 0,
                reason: leakedKeys.length === 0 ? "Zero live pointers detected. Pure static snapshot." : `Forbidden live keys leaked: ${leakedKeys.join(", ")}`
            };
        } catch (e) {
            return { passed: false, reason: "Circular reference or un-serializable node found" };
        }
    }
}

export default TestimonyValidator;
