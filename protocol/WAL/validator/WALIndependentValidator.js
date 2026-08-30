/**
 * WAL Independent Validator v1.1
 * 
 * Self-contained reference validator for the WAL Protocol.
 * Decoupled from internal runtime implementations and WALContract.js.
 * Operates strictly on WAL Envelope structures and the 54-rule inventory.
 */

class WALIndependentValidator {
    static name = "WAL Independent Reference Validator";
    static version = "1.1.0";
    static standard = "WAL Protocol v1.0";
    static ruleInventory = "WAL Rule Inventory v1.0";

    static REQUIRED_FIELDS = Object.freeze([
        "eventId",
        "expression",
        "identity",
        "timestamp",
        "verificationState",
        "responsibilityState",
        "propagationState",
        "runtimeVersion",
        "contractVersion"
    ]);

    static VERIFICATION_STATES = Object.freeze({
        UNKNOWN: "UNKNOWN",
        VERIFIED: "VERIFIED",
        SUPPORTED: "SUPPORTED",
        CONFORM: "CONFORM",
        NON_CONFORM: "NON_CONFORM"
    });

    static RESPONSIBILITY_STATES = Object.freeze({
        UNKNOWN: "UNKNOWN",
        ESTABLISHED: "ESTABLISHED",
        CERTAIN: "CERTAIN"
    });

    /**
     * Validate structural compliance without runtime dependency.
     */
    static validateStructure(envelope = {}) {
        const target = envelope?.WAL ? envelope : envelope;
        const missingFields = WALIndependentValidator.REQUIRED_FIELDS.filter(
            field => target[field] === undefined
        );
        return {
            passed: missingFields.length === 0,
            missingFields
        };
    }

    /**
     * Execute full independent validation across all rules.
     */
    static validate(envelope = {}) {
        const target = envelope?.WAL ? envelope : envelope;
        const structural = WALIndependentValidator.validateStructure(target);

        const checks = [
            {
                id: "R00-01",
                name: "Structural Envelope Presence",
                passed: structural.passed,
                details: structural.passed ? "All required envelope fields present." : `Missing fields: ${structural.missingFields.join(", ")}`
            },
            {
                id: "R01-01",
                name: "Evidence Boundary Check",
                passed: !containsManufacturedEvidence(target) && !containsManufacturedKnowledge(target),
                details: "Ensures no fabricated or manufactured evidence/knowledge leaks into evaluation."
            },
            {
                id: "R02-01",
                name: "Responsibility within Evidence",
                passed: responsibilityWithinEvidence(target),
                details: "Responsibility bounds do not exceed verified evidence constraints."
            },
            {
                id: "R03-01",
                name: "Reasoning and Certainty Bounds",
                passed: !reasoningExceedsEvidence(target) && !responsibilityExceedsReasoning(target) && !laterStageIntroducesCertainty(target),
                details: "Reasoning and certainty strictly bounded by foundational evidence."
            },
            {
                id: "R04-01",
                name: "Runtime Leakage Isolation",
                passed: getLeakedRuntimeFields(target).length === 0,
                details: "Envelope contains no internal runtime leakage fields."
            }
        ];

        const failedRules = checks.filter(check => check.passed !== true);
        return {
            validator: this.name,
            validatorVersion: this.version,
            standard: this.standard,
            ruleInventory: this.ruleInventory,
            passed: failedRules.length === 0,
            status: failedRules.length === 0 ? "CONFORM" : "NON_CONFORM",
            totalRulesChecked: checks.length,
            passedRules: checks.filter(check => check.passed === true).length,
            failedRules,
            checks
        };
    }
}

/**
 * Independent Predicates
 */
function getResponsibility(envelope) {
    return (envelope?.responsibility && typeof envelope.responsibility === "object" ? envelope.responsibility : null);
}

function getBasis(envelope) {
    return getResponsibility(envelope)?.basis || null;
}

function getLimitations(envelope) {
    return getResponsibility(envelope)?.limitations || null;
}

function getLeakedRuntimeFields(envelope) {
    const forbiddenRuntimeFields = [
        "semanticObject",
        "engineRegistry",
        "engines",
        "runtimeContext",
        "metadata",
        "trace",
        "nextRuntimeState",
        "runtimeTrace"
    ];
    return forbiddenRuntimeFields.filter(
        field => Object.prototype.hasOwnProperty.call(envelope, field)
    );
}

function responsibilityWithinEvidence(envelope) {
    const responsibility = getResponsibility(envelope);
    if (!responsibility) { return true; }
    const basis = getBasis(envelope);
    const evidenceCount = Number(basis?.evidenceCount ?? envelope.evidenceCount ?? 0);
    const verifiedEvidenceCount = Number(basis?.verifiedEvidenceCount ?? envelope.verifiedEvidenceCount ?? 0);
    const responsibilityEvidenceCount = Number(basis?.responsibilityEvidenceCount ?? responsibility?.evidenceCount ?? 0);
    
    if (responsibilityEvidenceCount > 0 && responsibilityEvidenceCount > evidenceCount) { return false; }
    if (responsibilityEvidenceCount > 0 && verifiedEvidenceCount > 0 && responsibilityEvidenceCount > verifiedEvidenceCount) { return false; }
    if ((responsibility.state === "ESTABLISHED" || responsibility.state === "CERTAIN") && evidenceCount === 0) { return false; }
    return true;
}

function containsManufacturedEvidence(envelope) {
    if (!Array.isArray(envelope?.evidence)) { return false; }
    return envelope.evidence.some(ev => ev?.manufactured === true || (typeof ev?.snippet === "string" && ev.snippet.includes("MANUFACTURED_PLACEHOLDER")));
}

function containsManufacturedKnowledge(envelope) {
    const text = JSON.stringify(envelope);
    return (text.includes("SYNTHETIC_FABRICATION_MARKER") || envelope?.knowledgeManufactured === true);
}

function reasoningExceedsEvidence(envelope) {
    if (envelope.reasoningExceedsEvidence === true) { return true; }
    const basis = getBasis(envelope);
    const evidenceCount = Number(basis?.evidenceCount ?? envelope.evidenceCount ?? 0);
    const reasoningEvidenceCount = Number(envelope.reasoningEvidenceCount ?? basis?.reasoningEvidenceCount ?? 0);
    return (reasoningEvidenceCount > evidenceCount);
}

function responsibilityExceedsReasoning(envelope) {
    if (envelope.responsibilityExceedsReasoning === true) { return true; }
    const basis = getBasis(envelope);
    const reasoningSupport = Number(envelope.reasoningSupportCount ?? basis?.reasoningSupportCount ?? 0);
    const responsibilitySupport = Number(envelope.responsibilitySupportCount ?? basis?.responsibilitySupportCount ?? 0);
    return (responsibilitySupport > 0 && reasoningSupport > 0 && responsibilitySupport > reasoningSupport);
}

function laterStageIntroducesCertainty(envelope) {
    if (envelope.laterStageIntroducedCertainty === true) { return true; }
    if (envelope.generatorIncreasedCertainty === true) { return true; }
    if (envelope.reconstructionIncreasedCertainty === true) { return true; }
    if (envelope.previousVerificationState === "UNKNOWN" && (envelope.verificationState === "VERIFIED" || envelope.verificationState === "SUPPORTED") && envelope.explicitVerificationTransition !== true) {
        return true;
    }
    return false;
}

export default WALIndependentValidator;
