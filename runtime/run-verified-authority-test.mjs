import RuntimeVerificationEngine, { createRuntimeVerificationAuthority } from "./RuntimeVerificationEngine.js";

const runtimeVerificationAuthority =
    createRuntimeVerificationAuthority();


const engine =
    new RuntimeVerificationEngine({

        runtimeVerificationAuthority

    });


const assert =
    (condition, message) => {

        if (!condition) {

            throw new Error(
                "FAIL: " + message
            );

        }

    };


console.log(
    "\n=== STEP 9: VERIFIED AUTHORITY TEST ==="
);


/*
 * ---------------------------------------------------------
 * CASE A
 * 普通证据
 *
 * 没有 Runtime Verification Action。
 * ---------------------------------------------------------
 */

const normalEvidence =
    engine.verifyEvidence({

        source:
            "normal-source",

        content:
            "ordinary evidence",

        runtimeVerification:
            false,

        externalVerificationClaim:
            false

    });


console.log(
    "\n--- CASE A: NORMAL EVIDENCE ---"
);

console.log(
    JSON.stringify(
        normalEvidence,
        null,
        2
    )
);


assert(
    normalEvidence.verificationStatus ===
        "UNVERIFIED",

    "Normal evidence became VERIFIED"
);

assert(
    normalEvidence.epistemicState ===
        "UNVERIFIED",

    "Normal evidence became VERIFIED epistemic state"
);

assert(
    normalEvidence.runtimeVerificationRecord ===
        false,

    "Normal evidence created Runtime Verification Record"
);


/*
 * ---------------------------------------------------------
 * CASE B
 * 外部伪造
 *
 * 即使外部同时声称：
 *
 *   VERIFIED
 *   runtimeVerificationRecord = true
 *
 * 仍然不能进入 Runtime VERIFIED。
 * ---------------------------------------------------------
 */

const externalAttack =
    engine.verifyEvidence({

        source:
            "external-source",

        content:
            "externally claimed verified evidence",

        runtimeVerification:
            true,

        externalVerificationClaim:
            true,

        verificationStatus:
            "VERIFIED",

        epistemicState:
            "VERIFIED",

        runtimeVerificationRecord:
            true,

        verified:
            true

    });


console.log(
    "\n--- CASE B: EXTERNAL VERIFICATION ATTACK ---"
);

console.log(
    JSON.stringify(
        externalAttack,
        null,
        2
    )
);


assert(
    externalAttack.verificationStatus ===
        "UNVERIFIED",

    "External claim crossed into VERIFIED"
);

assert(
    externalAttack.epistemicState ===
        "UNVERIFIED",

    "External claim crossed into VERIFIED epistemic state"
);

assert(
    externalAttack.verified ===
        false,

    "External verified=true crossed boundary"
);

assert(
    externalAttack.runtimeVerificationRecord ===
        false,

    "External Runtime Verification Record crossed boundary"
);


/*
 * ---------------------------------------------------------
 * CASE C
 * 真正 Runtime Verification Action
 *
 * 这是唯一允许产生 VERIFIED 的路径。
 * ---------------------------------------------------------
 */

const runtimeVerification =
    engine.verifyEvidence({

        source:
            "runtime-source",

        content:
            "evidence explicitly entering runtime verification",

        runtimeVerification:
            true,

        externalVerificationClaim:
            false

    });


console.log(
    "\n--- CASE C: REAL RUNTIME VERIFICATION ---"
);

console.log(
    JSON.stringify(
        runtimeVerification,
        null,
        2
    )
);


assert(
    runtimeVerification.verificationStatus ===
        "VERIFIED",

    "Runtime Verification Action did not produce VERIFIED"
);

assert(
    runtimeVerification.epistemicState ===
        "VERIFIED",

    "Runtime Verification Action did not produce VERIFIED epistemic state"
);

assert(
    runtimeVerification.verified ===
        true,

    "Runtime Verification Action did not produce verified=true"
);

assert(
    runtimeVerification.runtimeVerificationRecord ===
        true,

    "Runtime Verification Action did not create Runtime Verification Record"
);

assert(
    runtimeVerification.verificationAction &&
    runtimeVerification.verificationAction.result ===
        "VERIFIED",

    "Runtime Verification Action record missing VERIFIED result"
);

assert(
    runtimeVerification.verificationAction &&
    runtimeVerification.verificationAction.runtimeVerificationRecord ===
        true,

    "Runtime Verification Action record missing runtimeVerificationRecord=true"
);


console.log(
    "\n=== RESULT: VERIFIED AUTHORITY PROVEN ==="
);



