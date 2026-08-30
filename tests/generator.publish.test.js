import GeneratorEngine from "../runtime/GeneratorEngine.js";

function test(name, reconstruction) {

    const result =
        new GeneratorEngine({
            reconstruction,
            contract: {
                version: "10.8",
                identity: {
                    runtimeVersion: "10.8"
                }
            },
            pipeline: [],
            engines: {},
            runtimeTrace: []
        }).execute();

    console.log(
        JSON.stringify(
            {
                name,
                publishable:
                    result.report.publishable,
                verificationStatus:
                    result.report.verificationStatus,
                publishableText:
                    result.publishableText
            },
            null,
            2
        )
    );
}


test(
    "UNVERIFIED must not publish",
    {
        originalExpression: "原文",
        reconstructedExpression: "重构后的文章",
        reconstructionState: "UNVERIFIED",
        publishable: false,
        responsibilityChain: [
            {
                supported: false,
                verificationStatus: "UNVERIFIED",
                responsibilityBoundary: {
                    status: "matched"
                }
            }
        ]
    }
);


test(
    "SUPPORTED may publish",
    {
        originalExpression: "原文",
        reconstructedExpression: "重构后的文章",
        reconstructionState: "SUPPORTED",
        publishable: true,
        responsibilityChain: [
            {
                supported: true,
                verificationStatus: "SUPPORTED",
                epistemicState: "SUPPORTED",
                responsibilityBoundary: {
                    status: "matched"
                }
            }
        ]
    }
);
