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
    "\n=== STEP 28: HONEST RUNTIME VERIFICATION INTEGRATION ==="
);


const runtime =
    new HonestRuntime(
        "Runtime Verification integration evidence.",
        {
            evidence: [
                {
                    type:
                        "runtime-input",

                    source:
                        "RuntimeInput",

                    content:
                        "Runtime Verification integration evidence.",

                    origin:
                        "runtime",

                    runtimeVerification:
                        true,

                    runtimeVerificationRecord:
                        false,

                    externalVerificationClaim:
                        false
                }
            ]
        }
    );


const result =
    await runtime.run();


console.log(
    "\n--- RUNTIME VERIFICATION RESULT ---"
);

console.log(
    JSON.stringify(
        {
            verification:
                result.verificationBoundary,

            evidence:
                result.evidence,

            runtimeVerification:
                result.runtimeVerification ||
                null

        },
        null,
        2
    )
);


/*
 * ---------------------------------------------------------
 * 1. Runtime Verification Engine 必须真正执行
 * ---------------------------------------------------------
 */

assert(
    result.evidence,

    "HonestRuntime did not execute RuntimeVerificationEngine"
);


/*
 * ---------------------------------------------------------
 * 2. Runtime Verification 必须产生真实结果
 * ---------------------------------------------------------
 */

const runtimeVerification =
    result.runtimeVerification;


assert(
    runtimeVerification.verificationAction?.runtimeVerificationAuthorized ===
        true,

    "HonestRuntime did not receive Runtime Verification Authority"
);


/*
 * ---------------------------------------------------------
 * 3. Runtime Verification Boundary 必须被保留
 * ---------------------------------------------------------
 */

assert(
    result.verificationBoundary?.runtimeVerificationBoundary,

    "Runtime Verification Boundary was lost in HonestRuntime result projection"
);


/*
 * ---------------------------------------------------------
 * 4. Authority 必须真正允许 Runtime Verification
 * ---------------------------------------------------------
 */

assert(
    result.verificationBoundary
        .runtimeVerificationBoundary
        .runtimeVerificationAuthorized ===
        true,

    "Runtime Verification Authority did not reach final Runtime boundary"
);


/*
 * ---------------------------------------------------------
 * 5. 至少存在 Runtime Verification Record
 * ---------------------------------------------------------
 */

assert(
    runtimeVerification.runtimeVerificationRecordCount >
        0,

    "HonestRuntime did not create Runtime Verification Record"
);


console.log(
    "\n=== RESULT: HONEST RUNTIME VERIFICATION INTEGRATION PASSED ==="
);





