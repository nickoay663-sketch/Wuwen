import HonestRuntime from "../runtime/HonestRuntime.js";
import WALResponsibilityInterface from "../runtime/WALResponsibilityInterface.js";

const runtime =
    new HonestRuntime("杩欐槸涓€涓簨瀹?);

const result =
    await runtime.run();

const event =
    result?.responsibilityEvent;

const envelope =
    WALResponsibilityInterface
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
        "WAL payload test failed: responsibility is not an object."
    );
}

if (
    !inspection.responsibilityIsProjected
) {
    throw new Error(
        "WAL payload test failed: Runtime ResponsibilityEngine result leaked into WAL responsibility."
    );
}

if (
    inspection.responsibilityHasRuntimeFields
) {
    throw new Error(
        `WAL payload test failed: runtime fields leaked: ${leakedRuntimeFields.join(", ")}`
    );
}

if (
    !inspection.evidenceIsArray
) {
    throw new Error(
        "WAL payload test failed: evidence must be an array."
    );
}

if (
    !inspection.auditTrailIsArray
) {
    throw new Error(
        "WAL payload test failed: auditTrail must be an array."
    );
}

if (
    inspection.verificationState !==
    "UNKNOWN"
) {
    throw new Error(
        "WAL payload test failed: expected UNKNOWN verification state."
    );
}

if (
    inspection.responsibilityState !==
    "UNESTABLISHED"
) {
    throw new Error(
        "WAL payload test failed: expected UNESTABLISHED responsibility state."
    );
}

if (
    inspection.propagationState !==
    "REQUIRE_VERIFICATION"
) {
    throw new Error(
        "WAL payload test failed: expected REQUIRE_VERIFICATION propagation state."
    );
}

console.log(
    "\n=== WAL PAYLOAD BOUNDARY TEST PASSED ==="
);
