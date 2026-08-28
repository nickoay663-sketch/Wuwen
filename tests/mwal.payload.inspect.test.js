import HonestRuntime from "../runtime/HonestRuntime.js";
import MWALResponsibilityInterface from "../runtime/MWALResponsibilityInterface.js";

const runtime =
    new HonestRuntime("这是一个事实");

const result =
    await runtime.run();

const event =
    result?.responsibilityEvent;

const envelope =
    MWALResponsibilityInterface
        .fromResponsibilityEvent(event);

const responsibility =
    envelope?.responsibility;

const leakedRuntimeFields = [
    "semanticObject",
    "engineRegistry",
    "engines",
    "runtimeContext",
    "metadata",
    "trace",
    "nextRuntimeState",
    "result"
].filter(
    field =>
        Object.prototype.hasOwnProperty.call(
            responsibility || {},
            field
        )
);

const inspection = {
    envelopeKeys:
        Object.keys(envelope),

    responsibilityType:
        typeof responsibility,

    responsibilityKeys:
        responsibility &&
        typeof responsibility === "object"
            ? Object.keys(responsibility)
            : [],

    responsibilityHasSubject:
        !!responsibility?.subject,

    responsibilityHasScope:
        !!responsibility?.scope,

    responsibilityHasBasis:
        !!responsibility?.basis,

    responsibilityHasLimitations:
        !!responsibility?.limitations,

    responsibilityHasRuntimeFields:
        leakedRuntimeFields.length > 0,

    leakedRuntimeFields,

    evidenceIsArray:
        Array.isArray(envelope?.evidence),

    auditTrailIsArray:
        Array.isArray(envelope?.auditTrail),

    responsibilityIsProjected:
        !!responsibility &&
        typeof responsibility === "object" &&
        !Object.prototype.hasOwnProperty.call(
            responsibility,
            "engine"
        ) &&
        !Object.prototype.hasOwnProperty.call(
            responsibility,
            "semanticObject"
        ) &&
        !Object.prototype.hasOwnProperty.call(
            responsibility,
            "result"
        ),

    verificationState:
        envelope?.verificationState,

    responsibilityState:
        envelope?.responsibilityState,

    propagationState:
        envelope?.propagationState
};

console.log(
    JSON.stringify(
        inspection,
        null,
        2
    )
);

if (
    inspection.responsibilityType !==
    "object"
) {
    throw new Error(
        "MWAL payload test failed: responsibility is not an object."
    );
}

if (
    !inspection.responsibilityIsProjected
) {
    throw new Error(
        "MWAL payload test failed: Runtime ResponsibilityEngine result leaked into MWAL responsibility."
    );
}

if (
    inspection.responsibilityHasRuntimeFields
) {
    throw new Error(
        `MWAL payload test failed: runtime fields leaked: ${leakedRuntimeFields.join(", ")}`
    );
}

if (
    !inspection.evidenceIsArray
) {
    throw new Error(
        "MWAL payload test failed: evidence must be an array."
    );
}

if (
    !inspection.auditTrailIsArray
) {
    throw new Error(
        "MWAL payload test failed: auditTrail must be an array."
    );
}

if (
    inspection.verificationState !==
    "UNKNOWN"
) {
    throw new Error(
        "MWAL payload test failed: expected UNKNOWN verification state."
    );
}

if (
    inspection.responsibilityState !==
    "UNESTABLISHED"
) {
    throw new Error(
        "MWAL payload test failed: expected UNESTABLISHED responsibility state."
    );
}

if (
    inspection.propagationState !==
    "REQUIRE_VERIFICATION"
) {
    throw new Error(
        "MWAL payload test failed: expected REQUIRE_VERIFICATION propagation state."
    );
}

console.log(
    "\n=== MWAL PAYLOAD BOUNDARY TEST PASSED ==="
);
