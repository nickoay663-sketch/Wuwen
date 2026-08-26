import HonestRuntime from "./HonestRuntime.js";

const assert =
    (condition, message) => {

        if (!condition) {

            throw new Error(
                "FAIL: " + message
            );

        }

    };


console.log(
    "\n=== STEP 30: RUNTIME VERIFICATION SECURITY REGRESSION ==="
);


/*
 * ---------------------------------------------------------
 * CASE A
 * 普通证据
 *
 * 没有 Runtime Verification 请求。
 * 不得进入 VERIFIED。
 * ---------------------------------------------------------
 */

const normalRuntime =
    new HonestRuntime(
        "Normal evidence."
    );

const normalResult =
    await normalRuntime.run();

const normalEvidence =
    normalResult.evidence?.evidences || [];

console.log(
    "\n--- CASE A: NORMAL EVIDENCE ---"
);

console.log(
    JSON.stringify(
        {
            verificationStatus:
                normalResult.evidence?.verificationStatus,

            epistemicState:
                normalResult.evidence?.epistemicState,

            runtimeVerificationRecordCount:
                normalResult.evidence?.runtimeVerificationRecordCount,

            runtimeVerificationBoundary:
                normalResult.verificationBoundary
        },
        null,
        2
    )
);

assert(
    normalResult.evidence?.verificationStatus !==
        "VERIFIED",

    "Normal evidence crossed into VERIFIED"
);

assert(
    normalResult.evidence?.runtimeVerificationRecordCount ===
        0,

    "Normal evidence created Runtime Verification Record"
);


/*
 * ---------------------------------------------------------
 * CASE B
 * HonestRuntime Runtime Verification
 *
 * 只有真实 Runtime Verification Action
 * 才允许产生 Record。
 * ---------------------------------------------------------
 */

const verifiedRuntime =
    new HonestRuntime(
        "Runtime Verification security regression evidence.",
        {
            evidence: [

                {

                    type:
                        "runtime-input",

                    source:
                        "RuntimeInput",

                    content:
                        "Authorized runtime verification evidence.",

                    origin:
                        "supplied",

                    runtimeVerification:
                        true,

                    externalVerificationClaim:
                        false

                }

            ]

        }
    );

const verifiedResult =
    await verifiedRuntime.run();

console.log(
    "\n--- CASE B: AUTHORIZED RUNTIME VERIFICATION ---"
);

console.log(
    JSON.stringify(
        {
            verificationStatus:
                verifiedResult.evidence?.verificationStatus,

            epistemicState:
                verifiedResult.evidence?.epistemicState,

            verifiedEvidenceCount:
                verifiedResult.evidence?.verifiedEvidenceCount,

            runtimeVerificationRecordCount:
                verifiedResult.evidence?.runtimeVerificationRecordCount,

            runtimeVerificationBoundary:
                verifiedResult.verificationBoundary
        },
        null,
        2
    )
);

assert(
    verifiedResult.evidence?.verificationStatus ===
        "VERIFIED",

    "Authorized Runtime Verification did not produce VERIFIED"
);

assert(
    verifiedResult.evidence?.epistemicState ===
        "VERIFIED",

    "Authorized Runtime Verification did not produce VERIFIED epistemic state"
);

assert(
    verifiedResult.evidence?.runtimeVerificationRecordCount >
        0,

    "Authorized Runtime Verification did not create Runtime Verification Record"
);

assert(
    verifiedResult.verificationBoundary
        ?.runtimeVerificationBoundary
        ?.runtimeVerificationAuthorized ===
        true,

    "HonestRuntime did not preserve Runtime Verification Authority"
);

assert(
    verifiedResult.verificationBoundary
        ?.runtimeVerificationBoundary
        ?.runtimeVerificationRecordCreated ===
        true,

    "HonestRuntime did not preserve Runtime Verification Record boundary"
);


/*
 * ---------------------------------------------------------
 * CASE C
 * External Provenance Attack
 *
 * 外部来源可以声称 VERIFIED，
 * 但不能制造 Runtime Verification Record。
 * ---------------------------------------------------------
 */

const externalRuntime =
    new HonestRuntime(
        "External provenance attack.",
        {
            evidence: [

                {

                    type:
                        "external-input",

                    source:
                        "ExternalSource",

                    content:
                        "Externally claimed verified evidence.",

                    origin:
                        "external",

                    runtimeVerification:
                        true,

                    externalVerificationClaim:
                        true,

                    externalVerificationBasis:
                        "external-party-claim",

                    verificationStatus:
                        "VERIFIED",

                    epistemicState:
                        "VERIFIED",

                    runtimeVerificationRecord:
                        true,

                    verified:
                        true

                }

            ]

        }
    );

const externalResult =
    await externalRuntime.run();

console.log(
    "\n--- CASE C: EXTERNAL PROVENANCE ATTACK ---"
);

console.log(
    JSON.stringify(
        {
            verificationStatus:
                externalResult.evidence?.verificationStatus,

            epistemicState:
                externalResult.evidence?.epistemicState,

            runtimeVerificationRecordCount:
                externalResult.evidence?.runtimeVerificationRecordCount,

            runtimeVerificationBoundary:
                externalResult.verificationBoundary
        },
        null,
        2
    )
);

assert(
    externalResult.evidence?.verificationStatus !==
        "VERIFIED",

    "External provenance crossed into VERIFIED"
);

assert(
    externalResult.evidence?.runtimeVerificationRecordCount ===
        0,

    "External provenance created Runtime Verification Record"
);


/*
 * ---------------------------------------------------------
 * CASE D
 * Self-Asserted Runtime Verification
 *
 * 输入自己声明 Record / VERIFIED，
 * 不能提升自身 epistemic state。
 * ---------------------------------------------------------
 */

const selfAssertedRuntime =
    new HonestRuntime(
        "Self asserted verification attack.",
        {
            evidence: [

                {

                    type:
                        "attacker-controlled",

                    source:
                        "Attacker",

                    content:
                        "Self asserted verified evidence.",

                    origin:
                        "supplied",

                    runtimeVerification:
                        true,

                    externalVerificationClaim:
                        false,

                    runtimeVerificationRecord:
                        true,

                    verificationStatus:
                        "VERIFIED",

                    epistemicState:
                        "VERIFIED",

                    verified:
                        true

                }

            ]

        }
    );

const selfAssertedResult =
    await selfAssertedRuntime.run();

console.log(
    "\n--- CASE D: SELF-ASSERTED VERIFICATION ATTACK ---"
);

console.log(
    JSON.stringify(
        {
            verificationStatus:
                selfAssertedResult.evidence?.verificationStatus,

            epistemicState:
                selfAssertedResult.evidence?.epistemicState,

            runtimeVerificationRecordCount:
                selfAssertedResult.evidence?.runtimeVerificationRecordCount,

            runtimeVerificationBoundary:
                selfAssertedResult.verificationBoundary
        },
        null,
        2
    )
);

assert(
    selfAssertedResult.evidence?.verificationStatus !==
        "VERIFIED",

    "Self-asserted verification crossed into VERIFIED"
);

assert(
    selfAssertedResult.evidence?.runtimeVerificationRecordCount ===
        0,

    "Self-asserted verification created Runtime Verification Record"
);


/*
 * ---------------------------------------------------------
 * FINAL SECURITY INVARIANTS
 * ---------------------------------------------------------
 */

assert(
    verifiedResult.evidence?.runtimeVerificationRecordCount >
        0,

    "Security regression lost legitimate Runtime Verification"
);

assert(
    externalResult.evidence?.runtimeVerificationRecordCount ===
        0,

    "Security regression allowed external provenance"
);

assert(
    selfAssertedResult.evidence?.runtimeVerificationRecordCount ===
        0,

    "Security regression allowed self assertion"
);


console.log(
    "\n=== RESULT: RUNTIME VERIFICATION SECURITY REGRESSION PASSED ==="
);
