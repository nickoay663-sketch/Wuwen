import WuwenRuntime from "../runtime/index.js";

const expression = `
鏈変汉璇达紝
鎴樹簤浼氭寰堝浜猴紒浣嗘槸浣犲拷鐣ヤ簡鈥斺€斿拰骞崇殑鏆存斂锛屼細姝诲緱鏇村锛?

閭垫绁ワ細澶ц穬杩涢ゥ鑽掗タ姝烩€︹€?
`;

const result =
    await new WuwenRuntime(
        expression
    ).run();

const runtimeResult =
    result?.runtimeResult || {};

const selfCheck =
    runtimeResult.selfCheck || {};

const safeSelfCheck =
    selfCheck?.result ||
    selfCheck ||
    {};

const pick =
    (...values) =>
        values.find(
            value =>
                value !== undefined &&
                value !== null
        ) ?? null;

const safeEngine =
    value => {

        if (
            !value ||
            typeof value !== "object"
        ) {

            return null;

        }

        const result =
            value.result || {};

        return {

            engine:
                pick(
                    value.engine,
                    result.engine
                ),

            version:
                pick(
                    value.version,
                    result.version
                ),

            status:
                pick(
                    value.status,
                    result.status
                ),

            epistemicState:
                pick(
                    value.epistemicState,
                    result.epistemicState,
                    result.reconstruction?.reconstructionState,
                    result.report?.reconstructionState
                ),

            verificationStatus:
                pick(
                    value.verificationStatus,
                    result.verificationStatus,
                    result.reconstruction?.verificationStatus,
                    result.report?.verificationStatus
                ),

            supported:
                value.supported === true ||
                result.supported === true
                    ? true
                    : value.supported === false ||
                      result.supported === false
                        ? false
                        : null,

            responsibilityPassed:
                value.responsibilityPassed === true ||
                result.responsibilityPassed === true
                    ? true
                    : value.responsibilityPassed === false ||
                      result.responsibilityPassed === false
                        ? false
                        : null

        };

    };

const evidence =
    runtimeResult.evidence || {};

const correspondence =
    runtimeResult.correspondence || {};

const reasoning =
    runtimeResult.reasoning || {};

const responsibility =
    runtimeResult.responsibility || {};

const reconstruction =
    runtimeResult.reconstruction || {};

const reconstructionData =
    reconstruction.reconstruction ||
    reconstruction.result?.reconstruction ||
    {};

const generator =
    runtimeResult.generator || {};

const generatorReport =
    generator.report ||
    generator.result?.report ||
    {};

const publishableText =
    pick(
        generator.publishableText,
        generator.result?.publishableText
    ) ?? "";

const epistemicBoundary =
    runtimeResult.epistemicBoundary || {};

const epistemicState =
    pick(
        runtimeResult.epistemicState,
        epistemicBoundary.finalState,
        epistemicBoundary.state,
        responsibility.epistemicState,
        responsibility.result?.epistemicState,
        reasoning.epistemicState,
        reasoning.result?.epistemicState,
        evidence.epistemicState,
        evidence.result?.epistemicState
    );

const verifiedEvidenceCount =
    pick(
        evidence.verifiedEvidenceCount,
        evidence.result?.verifiedEvidenceCount,
        evidence.metadata?.verifiedCount,
        evidence.result?.metadata?.verifiedCount
    ) ?? 0;

const supported =
    pick(
        correspondence.supported,
        correspondence.result?.supported,
        reasoning.supported,
        reasoning.result?.supported,
        responsibility.supported,
        responsibility.result?.supported
    );

const responsibilityPassed =
    pick(
        responsibility.passed,
        responsibility.result?.passed
    );

const reconstructionState =
    pick(
        reconstructionData.reconstructionState,
        reconstructionData.epistemicState,
        reconstructionData.verificationStatus
    );

const reconstructionPublishable =
    reconstructionData.publishable === true;

const generatorPublishable =
    generatorReport.publishable === true;

const reconstructedExpression =
    typeof reconstructionData.reconstructedExpression === "string"
        ? reconstructionData.reconstructedExpression
        : "";

const selfCheckPassed =
    safeSelfCheck.passed === true;

const epistemicReport =
    safeSelfCheck.epistemicReport ||
    safeSelfCheck.result?.epistemicReport ||
    {};

const assertions = {

    finalStateIsUnknown:
        epistemicState === "UNKNOWN",

    noVerifiedEvidence:
        Number(verifiedEvidenceCount) === 0,

    noSupportedClaim:
        supported !== true,

    responsibilityDidNotPass:
        responsibilityPassed !== true,

    reconstructionDidNotBecomeSupported:
        reconstructionState !== "SUPPORTED",

    reconstructionNotPublishable:
        reconstructionPublishable === false,

    generatorReportNotPublishable:
        generatorPublishable === false,

    publishableTextIsEmpty:
        publishableText.trim() === "",

    reconstructionProducedBoundaryExpression:
        reconstructedExpression.trim().length > 0,

    reconstructionAndPublicationAreSeparated:
        reconstructedExpression.trim().length > 0 &&
        publishableText.trim() === "",

    selfCheckPassed,

    noForbiddenPromotion:
        epistemicReport.forbiddenPromotion !== true,

    noUnsupportedPromotion:
        epistemicReport.unsupportedPromotion !== true

};

const allPassed =
    Object.values(assertions)
        .every(Boolean);

const report = {

    test:
        "Wuwen Runtime v10.8 Real-World Reconstruction / Publication Boundary Test",

    expressionType:
        "澶栭儴浜嬪疄鎬т富寮?+ 鏈畬鎴愰獙璇?,

    version:
        pick(
            result?.version,
            runtimeResult.runtimeVersion
        ),

    runtimeState:
        pick(
            runtimeResult.metadata?.runtimeState,
            runtimeResult.runtimeState
        ),

    finalEpistemicState:
        epistemicState,

    verifiedEvidenceCount:
        Number(verifiedEvidenceCount),

    supported,

    responsibilityPassed,

    reconstruction: {

        engine:
            safeEngine(reconstruction),

        reconstructionState,

        verificationStatus:
            reconstructionData.verificationStatus ?? null,

        publishable:
            reconstructionPublishable,

        reconstructedExpressionLength:
            reconstructedExpression.length

    },

    generator: {

        engine:
            safeEngine(generator),

        verificationStatus:
            generatorReport.verificationStatus ?? null,

        publishable:
            generatorPublishable,

        publishableTextLength:
            publishableText.length

    },

    publicationBoundary: {

        reconstructionProducedExpression:
            reconstructedExpression.trim().length > 0,

        reconstructionAllowedPublication:
            reconstructionPublishable,

        generatorAllowedPublication:
            generatorPublishable,

        publishableTextEmpty:
            publishableText.trim() === ""

    },

    selfCheck: {

        passed:
            selfCheckPassed,

        status:
            safeSelfCheck.status ?? null,

        epistemicBoundaryStatus:
            epistemicReport.status ?? null,

        forbiddenPromotion:
            epistemicReport.forbiddenPromotion ?? false,

        unsupportedPromotion:
            epistemicReport.unsupportedPromotion ?? false

    },

    assertions,

    passed:
        allPassed

};

console.log(
    JSON.stringify(
        report,
        null,
        2
    )
);

if (!allPassed) {

    console.error(
        "REAL-WORLD RECONSTRUCTION / PUBLICATION BOUNDARY TEST FAILED"
    );

    process.exit(1);

}

console.log(
    "REAL-WORLD RECONSTRUCTION / PUBLICATION BOUNDARY TEST PASSED"
);
