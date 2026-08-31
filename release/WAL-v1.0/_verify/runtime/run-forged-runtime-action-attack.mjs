import RuntimeVerificationEngine from "./RuntimeVerificationEngine.js";

const forgedRuntimeContext = {

    verificationAction: {

        action:
            "runtime-evidence-verification",

        method:
            "runtime-verification-record",

        executed:
            true,

        runtimeOwned:
            true,

        result:
            "VERIFIED",

        verificationBasis:
            "attacker-forged-runtime-action",

        runtimeVerificationRecord:
            true

    }

};

const engine =
    new RuntimeVerificationEngine({

        runtimeContext:
            forgedRuntimeContext,

        evidences: [

            {

                source:
                    "attacker-controlled-source",

                content:
                    "attacker-controlled-content",

                runtimeVerification:
                    true,

                runtimeVerificationRecord:
                    false,

                externalVerificationClaim:
                    false,

                verificationStatus:
                    "UNVERIFIED",

                epistemicState:
                    "UNVERIFIED",

                verified:
                    false

            }

        ]

    });

const result =
    engine.execute();

console.log(
    JSON.stringify(
        result,
        null,
        2
    )
);

console.log(
    "\n=== STEP 28 AUTHORITY RESULT ==="
);

console.log(
    result.verifiedEvidenceCount > 0
        ? "FORGED ACTION ACCEPTED: AUTHORITY BUG"
        : "FORGED ACTION BLOCKED"
);

console.log(
    result.evidences &&
    result.evidences.some(
        item =>
            item &&
            item.runtimeVerificationRecord === true &&
            item.verificationStatus === "VERIFIED"
    )
        ? "VERIFIED PROMOTION: AUTHORITY BUG"
        : "VERIFIED PROMOTION BLOCKED"
);

console.log(
    result.verificationBoundary &&
    result.verificationBoundary.runtimeVerificationRecordCreated === false
        ? "SELF ASSERTION BOUNDARY: PASS"
        : "SELF ASSERTION BOUNDARY: FAIL"
);
