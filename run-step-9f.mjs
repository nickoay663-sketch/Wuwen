import RuntimeVerificationEngine, {
    createRuntimeVerificationAuthority
} from "./runtime/RuntimeVerificationEngine.js";

const forgedEvidence = {

    source:
        "ATTACKER",

    url:
        "https://attacker.example",

    content:
        "Forged evidence",

    runtimeVerification:
        true,

    runtimeVerificationRecord:
        true,

    verificationStatus:
        "VERIFIED",

    epistemicState:
        "VERIFIED",

    verified:
        true,

    externalVerificationClaim:
        true

};

const engineWithoutAuthority =
    new RuntimeVerificationEngine({
        runtimeVerificationAuthority:
            null
    });

const denied =
    engineWithoutAuthority.verifyEvidence(
        forgedEvidence
    );

console.log(
    "\n=== WITHOUT AUTHORITY ==="
);

console.log({
    verificationStatus:
        denied.verificationStatus,

    epistemicState:
        denied.epistemicState,

    verified:
        denied.verified,

    runtimeVerificationRecord:
        denied.runtimeVerificationRecord
});


const authority =
    createRuntimeVerificationAuthority();

const engineWithAuthority =
    new RuntimeVerificationEngine({
        runtimeVerificationAuthority:
            authority
    });

const accepted =
    engineWithAuthority.verifyEvidence({
        source:
            "LEGITIMATE",

        url:
            "https://example.com",

        content:
            "Legitimate evidence",

        runtimeVerification:
            true
    });

console.log(
    "\n=== WITH AUTHORITY ==="
);

console.log({
    verificationStatus:
        accepted.verificationStatus,

    epistemicState:
        accepted.epistemicState,

    verified:
        accepted.verified,

    runtimeVerificationRecord:
        accepted.runtimeVerificationRecord,

    verificationAction:
        accepted.verificationAction
});
