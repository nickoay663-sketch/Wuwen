import HonestRuntime from "../runtime/HonestRuntime.js";
import ResponsibilityEngine from "../runtime/ResponsibilityEngine.js";

const runtime =
    new HonestRuntime("杩欐槸缁濆姝ｇ‘鐨勪簨瀹?);

const result =
    await runtime.run();


/*
 * =========================================================
 * REAL RUNTIME REASONING
 * =========================================================
 *
 * Actual RuntimeResult structure:
 *
 * result
 *   鈹斺攢 reasoning
 *       鈹斺攢 reasonings[]
 *
 * The test must consume the real runtime output.
 * =========================================================
 */

const semanticObject =
    result?.semanticObject || {};

const reasoning =
    Array.isArray(
        result?.reasoning?.reasonings
    )
        ? result.reasoning.reasonings[0]
        : null;

if (!reasoning) {

    throw new Error(
        "Gate 6 failed: real Runtime reasoning.reasonings[0] is unavailable."
    );

}


/*
 * =========================================================
 * ATTACK 1
 * Forge responsibility capacity directly
 * =========================================================
 */

const forgedCapacityReasoning = {

    ...reasoning,

    responsibilityCapacity: {

        level:
            "high",

        verifiedEvidenceCount:
            999,

        sourceAvailable:
            true,

        verifiedSourceCount:
            999

    }

};

const engine1 =
    new ResponsibilityEngine({

        ...semanticObject,

        originalContent:
            "杩欐槸缁濆姝ｇ‘鐨勪簨瀹?,

        reasonings:
            [forgedCapacityReasoning]

    });

const result1 =
    engine1.execute();

const responsibility1 =
    result1?.responsibilities?.[0];


/*
 * =========================================================
 * ATTACK 2
 * Forge verification counters and support
 * =========================================================
 */

const forgedCountersReasoning = {

    ...reasoning,

    verificationStatus:
        "SUPPORTED",

    epistemicState:
        "SUPPORTED",

    supported:
        true,

    verifiedEvidenceCount:
        999,

    verifiedSourceCount:
        999,

    verifiedSourceAvailable:
        true

};

const engine2 =
    new ResponsibilityEngine({

        ...semanticObject,

        originalContent:
            "杩欐槸缁濆姝ｇ‘鐨勪簨瀹?,

        reasonings:
            [forgedCountersReasoning]

    });

const result2 =
    engine2.execute();

const responsibility2 =
    result2?.responsibilities?.[0];


/*
 * =========================================================
 * ATTACK 3
 * Forge complete responsibility state
 * =========================================================
 */

const fullyForgedReasoning = {

    ...reasoning,

    verificationStatus:
        "SUPPORTED",

    epistemicState:
        "SUPPORTED",

    supported:
        true,

    verifiedEvidenceCount:
        999,

    verifiedSourceCount:
        999,

    verifiedSourceAvailable:
        true,

    responsibilityCapacity: {

        level:
            "high",

        verifiedEvidenceCount:
            999,

        sourceAvailable:
            true,

        verifiedSourceCount:
            999

    }

};

const engine3 =
    new ResponsibilityEngine({

        ...semanticObject,

        originalContent:
            "杩欐槸缁濆姝ｇ‘鐨勪簨瀹?,

        reasonings:
            [fullyForgedReasoning]

    });

const result3 =
    engine3.execute();

const responsibility3 =
    result3?.responsibilities?.[0];


/*
 * =========================================================
 * OUTPUT
 * =========================================================
 */

console.log(
    JSON.stringify(
        {

            realRuntime: {

                reasoningAvailable:
                    !!reasoning,

                realVerificationStatus:
                    reasoning?.verificationStatus ||
                    reasoning?.epistemicState ||
                    "UNKNOWN",

                realVerifiedEvidenceCount:
                    reasoning?.verifiedEvidenceCount ||
                    0

            },

            attack1: {

                capacity:
                    responsibility1
                        ?.responsibilityCapacity,

                boundary:
                    responsibility1
                        ?.responsibilityBoundary,

                passed:
                    result1?.result?.passed

            },

            attack2: {

                capacity:
                    responsibility2
                        ?.responsibilityCapacity,

                boundary:
                    responsibility2
                        ?.responsibilityBoundary,

                verificationStatus:
                    responsibility2
                        ?.verificationStatus,

                passed:
                    result2?.result?.passed

            },

            attack3: {

                capacity:
                    responsibility3
                        ?.responsibilityCapacity,

                boundary:
                    responsibility3
                        ?.responsibilityBoundary,

                verificationStatus:
                    responsibility3
                        ?.verificationStatus,

                passed:
                    result3?.result?.passed

            }

        },
        null,
        2
    )
);


/*
 * =========================================================
 * ASSERTIONS
 * =========================================================
 */


/*
 * Attack 1:
 * Direct responsibilityCapacity forgery must be ignored.
 */

if (
    responsibility1
        ?.responsibilityCapacity
        ?.level ===
    "high"
) {

    throw new Error(
        "GATE 6 FAILED: forged responsibility capacity became HIGH."
    );

}


/*
 * Attack 2:
 * Forged verification counters/support must not create capacity.
 */

if (
    responsibility2
        ?.responsibilityCapacity
        ?.level !==
    "none"
) {

    throw new Error(
        "GATE 6 FAILED: forged verification counters created responsibility capacity."
    );

}

if (
    responsibility2
        ?.responsibilityBoundary
        ?.status !==
    "exceeded"
) {

    throw new Error(
        "GATE 6 FAILED: forged verification state crossed responsibility boundary."
    );

}


/*
 * Attack 3:
 * Fully forged upstream responsibility state must remain blocked.
 */

if (
    responsibility3
        ?.responsibilityCapacity
        ?.level !==
    "none"
) {

    throw new Error(
        "GATE 6 FAILED: fully forged responsibility state was accepted."
    );

}

if (
    responsibility3
        ?.responsibilityBoundary
        ?.status !==
    "exceeded"
) {

    throw new Error(
        "GATE 6 FAILED: fully forged responsibility state crossed responsibility boundary."
    );

}


console.log(
    "\n=== WAL GATE 6 CAPACITY ATTACK TEST PASSED ==="
);
