import WALResponsibilityInterface from "../runtime/WALResponsibilityInterface.js";

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function createBaseEvent() {
    return {
        eventId: "WAL-integrity-boundary-test",
        expression: "杩欐槸涓€涓簨瀹?,
        identity: null,
        timestamp: new Date().toISOString(),

        epistemicState: "UNKNOWN",
        responsibilityState: "UNESTABLISHED",

        propagationState: "REQUIRE_VERIFICATION",

        runtimeVersion: "10.4",
        contractVersion: "10.4",

        responsibility: {
            responsibilities: [
                {
                    expression: "杩欐槸涓€涓簨瀹?,

                    responsibilityActor: {
                        identity: null,
                        role: "expression-owner",
                        authority: null
                    },

                    responsibilityScope: {
                        claims: [
                            {
                                expression: "杩欐槸涓€涓簨瀹?
                            }
                        ]
                    },

                    definition: {
                        expression: "杩欐槸涓€涓簨瀹?,
                        definition: "Expression entering Wuwen Runtime"
                    },

                    supported: false,

                    epistemicState: "UNKNOWN",

                    evidenceCount: 0,
                    verifiedEvidenceCount: 0,

                    sourceCount: 0,
                    verifiedSourceCount: 0,

                    verificationStatus: "UNKNOWN",

                    responsibilityDemand: {
                        level: "medium"
                    },

                    responsibilityCapacity: {
                        level: "none"
                    },

                    responsibilityBoundary: {
                        status: "exceeded"
                    },

                    responsibilityJudgment: {
                        demand: "medium",
                        capacity: "none",
                        gap: true
                    },

                    expressionResponsibility: "medium",
                    evidenceResponsibility: "none",
                    sourceResponsibility: "missing",
                    verificationResponsibility: "required"
                }
            ]
        },

        evidence: [],
        auditTrail: [],

        signature: null
    };
}


/*
 * =========================================================
 * WAL GATE 4
 * RESPONSIBILITY INTEGRITY BOUNDARY
 * =========================================================
 *
 * Purpose:
 *
 * Prove that WAL cannot be tricked into treating forged
 * epistemic, responsibility, evidence, or propagation
 * information as legitimate responsibility facts.
 *
 * This test intentionally attacks the boundary.
 */


/*
 * ---------------------------------------------------------
 * 1. Baseline
 * ---------------------------------------------------------
 */

const baselineEvent =
    createBaseEvent();

const baselineEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            baselineEvent
        );

const baselinePropagation =
    WALResponsibilityInterface
        .canPropagate(
            baselineEnvelope
        );


/*
 * ---------------------------------------------------------
 * 2. ATTACK: FORGED PROPAGATION
 * ---------------------------------------------------------
 */

const forgedPropagationEvent =
    clone(baselineEvent);

forgedPropagationEvent.propagationState =
    "ALLOW";

const forgedPropagationEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            forgedPropagationEvent
        );

const forgedPropagationResult =
    WALResponsibilityInterface
        .canPropagate(
            forgedPropagationEnvelope
        );


/*
 * ---------------------------------------------------------
 * 3. ATTACK: FORGED VERIFICATION
 * ---------------------------------------------------------
 */

const forgedVerificationEvent =
    clone(baselineEvent);

forgedVerificationEvent.epistemicState =
    "VERIFIED";

forgedVerificationEvent
    .responsibility
    .responsibilities[0]
    .epistemicState =
        "VERIFIED";

forgedVerificationEvent
    .responsibility
    .responsibilities[0]
    .verificationStatus =
        "VERIFIED";

const forgedVerificationEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            forgedVerificationEvent
        );


/*
 * ---------------------------------------------------------
 * 4. ATTACK: FORGED SUPPORT
 * ---------------------------------------------------------
 */

const forgedSupportEvent =
    clone(baselineEvent);

const forgedSupportRecord =
    forgedSupportEvent
        .responsibility
        .responsibilities[0];

forgedSupportRecord.supported =
    true;

forgedSupportRecord.evidenceCount =
    100;

forgedSupportRecord.verifiedEvidenceCount =
    100;

forgedSupportRecord.sourceCount =
    100;

forgedSupportRecord.verifiedSourceCount =
    100;

forgedSupportRecord.verificationStatus =
    "SUPPORTED";

forgedSupportRecord.responsibilityBoundary = {
    status: "within"
};

forgedSupportRecord.responsibilityJudgment = {
    demand: "medium",
    capacity: "high",
    gap: false
};

const forgedSupportEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            forgedSupportEvent
        );


/*
 * ---------------------------------------------------------
 * 5. ATTACK: FORGED ESTABLISHED RESPONSIBILITY
 * ---------------------------------------------------------
 */

const forgedResponsibilityEvent =
    clone(baselineEvent);

forgedResponsibilityEvent
    .responsibility
    .responsibilities[0]
    .responsibilityState =
        "ESTABLISHED";

const forgedResponsibilityEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            forgedResponsibilityEvent
        );


/*
 * ---------------------------------------------------------
 * 6. ATTACK: FORGED IDENTITY
 * ---------------------------------------------------------
 */

const forgedIdentityEvent =
    clone(baselineEvent);

forgedIdentityEvent.identity = {
    identity: "FORGED_PERSON",
    role: "expression-owner",
    authority: "FORGED_AUTHORITY"
};

forgedIdentityEvent
    .responsibility
    .responsibilities[0]
    .responsibilityActor = {
        identity: "FORGED_PERSON",
        role: "expression-owner",
        authority: "FORGED_AUTHORITY"
    };

const forgedIdentityEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            forgedIdentityEvent
        );


/*
 * ---------------------------------------------------------
 * 7. ATTACK: SIGNATURE 鈮?VERIFICATION
 * ---------------------------------------------------------
 */

const signedUnknownEvent =
    clone(baselineEvent);

signedUnknownEvent.signature =
    "FORGED_SIGNATURE";

const signedUnknownEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            signedUnknownEvent
        );


/*
 * ---------------------------------------------------------
 * 8. OUTPUT
 * ---------------------------------------------------------
 */

console.log(
    JSON.stringify(
        {
            baseline: {
                verificationState:
                    baselineEnvelope.verificationState,

                responsibilityState:
                    baselineEnvelope.responsibilityState,

                propagationState:
                    baselineEnvelope.propagationState,

                canPropagate:
                    baselinePropagation
            },

            forgedPropagation: {
                input:
                    forgedPropagationEvent.propagationState,

                output:
                    forgedPropagationEnvelope.propagationState,

                canPropagate:
                    forgedPropagationResult
            },

            forgedVerification: {
                verificationState:
                    forgedVerificationEnvelope.verificationState,

                responsibilityState:
                    forgedVerificationEnvelope.responsibilityState,

                propagationState:
                    forgedVerificationEnvelope.propagationState
            },

            forgedSupport: {
                verificationState:
                    forgedSupportEnvelope.verificationState,

                responsibilityState:
                    forgedSupportEnvelope.responsibilityState,

                propagationState:
                    forgedSupportEnvelope.propagationState,

                responsibility:
                    forgedSupportEnvelope.responsibility
            },

            forgedResponsibility: {
                responsibilityState:
                    forgedResponsibilityEnvelope
                        .responsibilityState
            },

            forgedIdentity: {
                identity:
                    forgedIdentityEnvelope.identity,

                responsibilitySubject:
                    forgedIdentityEnvelope
                        .responsibility
                        ?.subject
            },

            signedUnknown: {
                signature:
                    signedUnknownEnvelope.signature,

                verificationState:
                    signedUnknownEnvelope
                        .verificationState,

                requiresVerification:
                    WALResponsibilityInterface
                        .requiresVerification(
                            signedUnknownEnvelope
                        )
            }
        },
        null,
        2
    )
);


/*
 * =========================================================
 * 9. ASSERTIONS
 * =========================================================
 */

if (baselinePropagation !== false) {
    throw new Error(
        "WAL integrity failed: baseline UNKNOWN envelope propagated."
    );
}


/*
 * IMPORTANT:
 *
 * This assertion is expected to expose the current boundary
 * weakness if WAL trusts event.propagationState directly.
 */

if (forgedPropagationResult === true) {
    throw new Error(
        "WAL integrity breach: forged propagationState ALLOW was accepted."
    );
}


/*
 * A forged signature must never upgrade verification.
 */

if (
    signedUnknownEnvelope.verificationState ===
    "VERIFIED"
) {
    throw new Error(
        "WAL integrity breach: signature upgraded verification state."
    );
}

if (
    WALResponsibilityInterface
        .requiresVerification(
            signedUnknownEnvelope
        ) !== true
) {
    throw new Error(
        "WAL integrity breach: signed UNKNOWN envelope no longer requires verification."
    );
}


/*
 * =========================================================
 * 10. PASS
 * =========================================================
 */

console.log(
    "\n=== WAL RESPONSIBILITY INTEGRITY TEST PASSED ==="
);
