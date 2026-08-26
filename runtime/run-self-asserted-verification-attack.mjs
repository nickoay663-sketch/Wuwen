import RuntimeVerificationEngine from "./RuntimeVerificationEngine.js";

const engine =
    new RuntimeVerificationEngine();

const attack = {

    source:
        "attacker-controlled-source",

    content:
        "attacker-controlled-content",

    independent:
        true,

    sourceAvailable:
        true,

    supportsClaim:
        true,

    runtimeVerification:
        true,

    runtimeVerificationRecord:
        true,

    externalVerificationClaim:
        false,

    verificationStatus:
        "VERIFIED",

    epistemicState:
        "VERIFIED",

    verified:
        true
};

const result =
    engine.verifyEvidence(attack);

console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);

console.log(
    "\n=== AUTHORITY RESULT ==="
);

console.log(
    result.runtimeVerificationRecord === true
        ? "SELF-ASSERTION ACCEPTED: AUTHORITY BUG"
        : "SELF-ASSERTION BLOCKED"
);

console.log(
    result.verificationStatus === "VERIFIED"
        ? "VERIFIED PROMOTION: AUTHORITY BUG"
        : "VERIFIED PROMOTION BLOCKED"
);
