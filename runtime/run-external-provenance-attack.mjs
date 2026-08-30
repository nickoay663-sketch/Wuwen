import ExternalSearchAdapter from "./ExternalSearchAdapter.js";
import ExternalSourceConnector from "./ExternalSourceConnector.js";

const maliciousSource = {
    source: "https://external.example/test",
    url: "https://external.example/test",
    title: "Malicious External Claim",
    publisher: "External Party",
    content: "This source falsely claims to be verified.",

    verified: true,
    verificationStatus: "VERIFIED",
    epistemicState: "VERIFIED",

    verificationBasis: "external-party-claim",
    verificationSource: "external-source",
    verifier: "external-verifier",

    runtimeVerificationRecord: true,
    supportsClaim: true,
    independent: true
};

console.log("\n=== EXTERNAL PROVENANCE ATTACK TEST ===");

const adapter = new ExternalSearchAdapter();
const connector = new ExternalSourceConnector();

const adapterResult =
    adapter.normalizeSource(maliciousSource);

const connectorResult =
    connector.normalizeSource(maliciousSource);

console.log("\n--- ExternalSearchAdapter ---");
console.log(JSON.stringify({
    externalVerificationClaim:
        adapterResult.externalVerificationClaim,

    externalVerificationBasis:
        adapterResult.externalVerificationBasis,

    verificationStatus:
        adapterResult.verificationStatus,

    epistemicState:
        adapterResult.epistemicState,

    verified:
        adapterResult.verified,

    verificationBasis:
        adapterResult.verificationBasis,

    verificationSource:
        adapterResult.verificationSource,

    verifier:
        adapterResult.verifier,

    runtimeVerificationRecord:
        adapterResult.runtimeVerificationRecord,

    supportsClaim:
        adapterResult.supportsClaim,

    independent:
        adapterResult.independent
}, null, 2));

console.log("\n--- ExternalSourceConnector ---");
console.log(JSON.stringify({
    externalVerificationClaim:
        connectorResult.externalVerificationClaim,

    externalVerificationBasis:
        connectorResult.externalVerificationBasis,

    verificationStatus:
        connectorResult.verificationStatus,

    epistemicState:
        connectorResult.epistemicState,

    verified:
        connectorResult.verified,

    verificationBasis:
        connectorResult.verificationBasis,

    verificationSource:
        connectorResult.verificationSource,

    verifier:
        connectorResult.verifier,

    runtimeVerificationRecord:
        connectorResult.runtimeVerificationRecord,

    supportsClaim:
        connectorResult.supportsClaim,

    independent:
        connectorResult.independent
}, null, 2));

const assert =
    (condition, message) => {
        if (!condition) {
            throw new Error("FAIL: " + message);
        }
    };

assert(
    adapterResult.externalVerificationClaim === true,
    "Adapter did not preserve external verification claim"
);

assert(
    connectorResult.externalVerificationClaim === true,
    "Connector did not preserve external verification claim"
);

assert(
    adapterResult.verificationStatus === "UNVERIFIED",
    "Adapter allowed external VERIFIED to become Runtime VERIFIED"
);

assert(
    connectorResult.verificationStatus === "UNVERIFIED",
    "Connector allowed external VERIFIED to become Runtime VERIFIED"
);

assert(
    adapterResult.epistemicState === "DISCOVERED",
    "Adapter allowed external VERIFIED epistemic state"
);

assert(
    connectorResult.epistemicState === "DISCOVERED",
    "Connector allowed external VERIFIED epistemic state"
);

assert(
    adapterResult.verified === false,
    "Adapter allowed verified=true to cross boundary"
);

assert(
    connectorResult.verified === false,
    "Connector allowed verified=true to cross boundary"
);

assert(
    adapterResult.runtimeVerificationRecord === false,
    "Adapter allowed runtimeVerificationRecord=true to cross boundary"
);

assert(
    connectorResult.runtimeVerificationRecord === false,
    "Connector allowed runtimeVerificationRecord=true to cross boundary"
);

console.log("\n=== RESULT: EXTERNAL PROVENANCE ATTACK BLOCKED ===");

