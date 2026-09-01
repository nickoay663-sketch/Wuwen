export function createValidEnvelope(overrides = {}) {
    return {
        eventId: "evt-" + Date.now(),
        expression: "default expression",
        identity: "id-default",
        timestamp: Date.now(),
        verificationState: "SUPPORTED",
        responsibilityState: "ESTABLISHED",
        propagationState: "ALLOW",
        runtimeVersion: "1.0",
        contractVersion: "1.0",

        definition: { exists: true },
        contract: { valid: true },

        verifiedEvidenceCount: 1,
        evidenceCount: 1,
        verificationStatus: "SUPPORTED",
        correspondence: true,

        responsibility: { scope: "bounded", correspondence: true },
        reasoning: { bounded: true },
        evidence: [{ id: "ev-1", type: "independent", verified: true }],

        manufacturedEvidence: false,
        manufacturedKnowledge: false,
        reconstructionManufacturedEvidence: false,
        reconstructionManufacturedKnowledge: false,
        reconstructionPurpose: "PRESERVATION",
        reconstructionPreservesIntent: true,
        automaticReconstruction: false,

        ...overrides
    };
}
