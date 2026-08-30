import HonestRuntime from "../runtime/HonestRuntime.js";
import WALResponsibilityInterface from "../runtime/WALResponsibilityInterface.js";

const runtime =
    new HonestRuntime("杩欐槸涓€涓簨瀹?);

const result =
    await runtime.run();

const event =
    result?.responsibilityEvent;

if (!event) {
    throw new Error(
        "WAL runtime-leak test failed: ResponsibilityEvent was not produced."
    );
}


/*
 * =========================================================
 * 1. REAL RUNTIME ENVELOPE
 * =========================================================
 */

const envelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(event);

const forbiddenTopLevelFields = [
    "engineRegistry",
    "runtimeContext",
    "semanticObject",
    "engines",
    "trace",
    "metadata",
    "nextRuntimeState"
];

const leakedTopLevelFields =
    forbiddenTopLevelFields.filter(
        field =>
            Object.prototype.hasOwnProperty.call(
                envelope,
                field
            )
    );


/*
 * =========================================================
 * 2. MALICIOUS NORMALIZED RECORD
 * =========================================================
 */

const maliciousRecord = {

    expression:
        "杩欐槸涓€涓簨瀹?,

    responsibilityActor: {
        identity: "test-identity",
        role: "expression-owner",
        authority: null
    },

    responsibilityScope: {},

    definition: {
        expression:
            "杩欐槸涓€涓簨瀹?,

        definition:
            "Expression entering Wuwen Runtime"
    },

    epistemicState:
        "UNKNOWN",

    supported:
        false,

    evidenceCount:
        0,

    verifiedEvidenceCount:
        0,

    sourceCount:
        0,

    verifiedSourceCount:
        0,

    verificationStatus:
        "UNKNOWN",

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

    expressionResponsibility:
        "medium",

    evidenceResponsibility:
        "none",

    sourceResponsibility:
        "missing",

    verificationResponsibility:
        "required",


    /*
     * FORBIDDEN RUNTIME INTERNALS
     */

    semanticObject: {
        secret:
            "RUNTIME_LEAK"
    },

    engineRegistry: {
        secret:
            "RUNTIME_REGISTRY_LEAK"
    },

    runtimeContext: {
        secret:
            "RUNTIME_CONTEXT_LEAK"
    },

    engines: {
        secret:
            "ENGINE_LEAK"
    },

    trace: {
        secret:
            "TRACE_LEAK"
    },

    metadata: {
        secret:
            "METADATA_LEAK"
    },

    nextRuntimeState:
        "RuntimeLeak"
};


/*
 * =========================================================
 * 3. POLLUTED RESPONSIBILITY EVENT
 * =========================================================
 */

const pollutedEvent = {

    eventId:
        "WAL-runtime-leak-test",

    expression:
        "杩欐槸涓€涓簨瀹?,

    identity:
        "test-identity",

    timestamp:
        new Date().toISOString(),

    epistemicState:
        "UNKNOWN",

    responsibilityState:
        "UNESTABLISHED",

    propagationState:
        "REQUIRE_VERIFICATION",

    runtimeVersion:
        "10.4",

    contractVersion:
        "10.4",

    responsibility: {
        responsibilities: [
            maliciousRecord
        ]
    },

    evidence: [],

    auditTrail: [],

    signature: null
};


/*
 * =========================================================
 * 4. PROJECT POLLUTED RECORD
 * ========================================================= */

const pollutedEnvelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(
            pollutedEvent
        );


/*
 * =========================================================
 * 5. DEEP LEAK CHECK
 * ========================================================= */

const pollutedSerialized =
    JSON.stringify(
        pollutedEnvelope
    );

const forbiddenLeakMarkers = [
    "RUNTIME_LEAK",
    "RUNTIME_REGISTRY_LEAK",
    "RUNTIME_CONTEXT_LEAK",
    "ENGINE_LEAK",
    "TRACE_LEAK",
    "METADATA_LEAK",
    "RuntimeLeak"
];

const leakedMarkers =
    forbiddenLeakMarkers.filter(
        marker =>
            pollutedSerialized.includes(
                marker
            )
    );


/*
 * =========================================================
 * 6. STRUCTURAL CHECKS
 * ========================================================= */

const evidenceIsArray =
    Array.isArray(
        envelope.evidence
    );

const auditTrailIsArray =
    Array.isArray(
        envelope.auditTrail
    );

const envelopeSerializable =
    (() => {
        try {
            JSON.stringify(envelope);
            return true;
        } catch {
            return false;
        }
    })();

const pollutedEnvelopeSerializable =
    (() => {
        try {
            JSON.stringify(pollutedEnvelope);
            return true;
        } catch {
            return false;
        }
    })();

const validation =
    WALResponsibilityInterface
        .validate(
            envelope
        );

const pollutedValidation =
    WALResponsibilityInterface
        .validate(
            pollutedEnvelope
        );

const propagation =
    WALResponsibilityInterface
        .canPropagate(
            pollutedEnvelope
        );

const verificationRequired =
    WALResponsibilityInterface
        .requiresVerification(
            pollutedEnvelope
        );


/*
 * =========================================================
 * 7. OUTPUT
 * ========================================================= */

console.log(
    JSON.stringify(
        {

            runtimeState:
                result?.metadata?.runtimeState,

            executionComplete:
                result?.metadata?.executionComplete,

            executionCompletedCount:
                result?.metadata?.executionCompletedCount,

            executionExpectedCount:
                result?.metadata?.executionExpectedCount,

            selfCheckPassed:
                result?.epistemicBoundary?.selfCheckPassed,

            responsibilityEventExists:
                !!event,

            WALEnvelopeKeys:
                Object.keys(
                    envelope
                ),

            leakedTopLevelFields,

            evidenceIsArray,

            auditTrailIsArray,

            envelopeSerializable,

            pollutedEnvelopeSerializable,

            pollutedEnvelopeKeys:
                Object.keys(
                    pollutedEnvelope
                ),

            leakedMarkers,

            validation,

            pollutedValidation,

            propagation,

            verificationRequired

        },
        null,
        2
    )
);


/*
 * =========================================================
 * 8. ASSERTIONS
 * ========================================================= */

if (
    leakedTopLevelFields.length !== 0
) {
    throw new Error(
        `WAL runtime leak detected: ${leakedTopLevelFields.join(", ")}`
    );
}

if (
    leakedMarkers.length !== 0
) {
    throw new Error(
        `WAL deep runtime leak detected: ${leakedMarkers.join(", ")}`
    );
}

if (!evidenceIsArray) {
    throw new Error(
        "WAL runtime leak test failed: evidence is not an array."
    );
}

if (!auditTrailIsArray) {
    throw new Error(
        "WAL runtime leak test failed: auditTrail is not an array."
    );
}

if (!envelopeSerializable) {
    throw new Error(
        "WAL runtime leak test failed: WAL envelope contains circular runtime state."
    );
}

if (!pollutedEnvelopeSerializable) {
    throw new Error(
        "WAL runtime leak test failed: polluted WAL envelope is not serializable."
    );
}

if (
    validation?.valid !== true
) {
    throw new Error(
        `WAL runtime leak test failed: envelope validation failed: ${JSON.stringify(validation)}`
    );
}

if (
    pollutedValidation?.valid !== true
) {
    throw new Error(
        `WAL runtime leak test failed: polluted envelope validation failed: ${JSON.stringify(pollutedValidation)}`
    );
}

if (
    pollutedEnvelope.propagationState !==
    "REQUIRE_VERIFICATION"
) {
    throw new Error(
        "WAL runtime leak test failed: polluted envelope propagation state was upgraded."
    );
}

if (propagation !== false) {
    throw new Error(
        "WAL runtime leak test failed: polluted envelope was allowed to propagate."
    );
}

if (verificationRequired !== true) {
    throw new Error(
        "WAL runtime leak test failed: polluted envelope did not require verification."
    );
}


/*
 * =========================================================
 * 9. PASS
 * ========================================================= */

console.log(
    "\n=== WAL RUNTIME LEAK TEST PASSED ==="
);
