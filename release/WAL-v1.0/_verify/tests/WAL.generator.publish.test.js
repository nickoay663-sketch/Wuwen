import assert from "node:assert/strict";
import GeneratorEngine from "../runtime/GeneratorEngine.js";
import ReportFormatter from "../runtime/ReportFormatter.js";


const supportedRuntimeObject = {

    contract: {

        identity: {

            runtimeVersion:
                "10.8"

        },

        version:
            "10.8"

    },

    pipeline: [

        "RecognitionEngine",
        "DefinitionEngine",
        "SearchEngine",
        "EvidenceEngine",
        "CorrespondenceEngine",
        "ReasoningEngine",
        "ResponsibilityEngine",
        "ReconstructionEngine",
        "GeneratorEngine",
        "SelfCheckEngine"

    ],

    engines: {},

    runtimeTrace: [],

    reconstruction: {

        originalExpression:
            "鍘熷琛ㄨ揪",

        reconstructedExpression:
            "閲嶆瀯鍚庣殑鏂囩珷",

        reconstructionState:
            "SUPPORTED",

        language:
            "zh-CN",

        responsibilityChain: [

            {

                supported:
                    true,

                verificationStatus:
                    "SUPPORTED",

                epistemicState:
                    "SUPPORTED",

                responsibilityBoundary: {

                    status:
                        "matched"

                }

            }

        ],

        evidenceChain: [],

        sources: [],

        boundaries: {},

        expansion:
            false,

        sourceExpansion:
            false,

        evidenceExpansion:
            false,

        publishable:
            true

    }

};


const unverifiedRuntimeObject = {

    ...supportedRuntimeObject,

    reconstruction: {

        ...supportedRuntimeObject.reconstruction,

        reconstructionState:
            "UNVERIFIED",

        responsibilityChain: [

            {

                supported:
                    false,

                verificationStatus:
                    "UNVERIFIED",

                epistemicState:
                    "UNVERIFIED",

                responsibilityBoundary: {

                    status:
                        "matched"

                }

            }

        ],

        publishable:
            false

    }

};


/*
 * =========================================================
 * 1. Generator锛歋UPPORTED
 * =========================================================
 */

const supportedGenerator =
    new GeneratorEngine(
        supportedRuntimeObject
    ).execute();

assert.equal(
    supportedGenerator.report.reconstructionState,
    "SUPPORTED"
);

assert.equal(
    supportedGenerator.report.publishable,
    true
);

assert.equal(
    supportedGenerator.publishableText,
    "閲嶆瀯鍚庣殑鏂囩珷"
);

assert.equal(
    supportedGenerator.report.responsibilityCount,
    1
);


/*
 * =========================================================
 * 2. Generator锛歎NVERIFIED
 * =========================================================
 */

const unverifiedGenerator =
    new GeneratorEngine(
        unverifiedRuntimeObject
    ).execute();

assert.equal(
    unverifiedGenerator.report.reconstructionState,
    "UNVERIFIED"
);

assert.equal(
    unverifiedGenerator.report.publishable,
    false
);

assert.equal(
    unverifiedGenerator.publishableText,
    ""
);


/*
 * =========================================================
 * 3. ReportFormatter锛歋UPPORTED projection
 * =========================================================
 */

const supportedRuntimeResult = {

    runtimeVersion:
        "10.8",

    metadata: {

        runtimeVersion:
            "10.8",

        contractVersion:
            "10.8",

        engineCount:
            10

    },

    generator:
        supportedGenerator,

    selfCheck: {

        result: {

            passed:
                true

        }

    }

};

const supportedReport =
    new ReportFormatter(
        supportedRuntimeResult
    ).run();

const supportedProjection =
    supportedReport.report.generator.report;

assert.equal(
    supportedProjection.reconstructionState,
    "SUPPORTED"
);

assert.equal(
    supportedProjection.publishable,
    true
);

assert.equal(
    supportedProjection.publishableText,
    "閲嶆瀯鍚庣殑鏂囩珷"
);

assert.equal(
    supportedProjection.verificationStatus,
    "SUPPORTED"
);

assert.equal(
    supportedProjection.sourceExpansion,
    false
);

assert.equal(
    supportedProjection.evidenceExpansion,
    false
);


/*
 * =========================================================
 * 4. ReportFormatter锛歎NVERIFIED projection
 * =========================================================
 */

const unverifiedRuntimeResult = {

    runtimeVersion:
        "10.8",

    metadata: {

        runtimeVersion:
            "10.8",

        contractVersion:
            "10.8",

        engineCount:
            10

    },

    generator:
        unverifiedGenerator,

    selfCheck: {

        result: {

            passed:
                true

        }

    }

};

const unverifiedReport =
    new ReportFormatter(
        unverifiedRuntimeResult
    ).run();

const unverifiedProjection =
    unverifiedReport.report.generator.report;

assert.equal(
    unverifiedProjection.reconstructionState,
    "UNVERIFIED"
);

assert.equal(
    unverifiedProjection.publishable,
    false
);

assert.equal(
    unverifiedProjection.publishableText,
    ""
);

assert.equal(
    unverifiedProjection.verificationStatus,
    "UNVERIFIED"
);


/*
 * =========================================================
 * 杈撳嚭
 * =========================================================
 */

console.log(
    JSON.stringify(
        {

            test:
                "Wuwen v10.8 WAL Generator Publication Projection Test",

            supported: {

                reconstructionState:
                    supportedProjection.reconstructionState,

                publishable:
                    supportedProjection.publishable,

                publishableText:
                    supportedProjection.publishableText,

                verificationStatus:
                    supportedProjection.verificationStatus

            },

            unverified: {

                reconstructionState:
                    unverifiedProjection.reconstructionState,

                publishable:
                    unverifiedProjection.publishable,

                publishableText:
                    unverifiedProjection.publishableText,

                verificationStatus:
                    unverifiedProjection.verificationStatus

            }

        },
        null,
        2
    )
);

console.log(
    "Wuwen v10.8 WAL Generator Publication Projection Test Passed."
);
