import HonestRuntime from "./HonestRuntime.js";

const runtimeVerificationSource = {

    source:
        "RuntimeVerifiedSource",

    content:
        "这是一个由 Runtime 验证记录支持的测试事实",

    type:
        "runtime-verification",

    origin:
        "runtime",

    independent:
        true,

    runtimeVerificationRecord:
        true,

    runtimeVerification:
        true,

    verificationBasis:
        "RuntimeVerificationTest",

    verificationSource:
        "RuntimeVerificationEngine",

    verifier:
        "WuwenRuntime"

};

const runtime =
    new HonestRuntime(
        "测试 Runtime 合法验证能力",
        {

            searchResults: [

                runtimeVerificationSource

            ],

            evidence: [

                runtimeVerificationSource

            ]

        }
    );

const result =
    await runtime.run();

const evidences =
    result.evidence?.evidences || [];

console.log(
    JSON.stringify(

        {

            test:
                "REAL_RUNTIME_VERIFICATION_POSITIVE",

            search: {

                sourceCount:
                    result.search?.sources?.length ?? null,

                outputState:
                    result.search?.outputState ?? null,

                verificationState:
                    result.search?.verificationState ?? null

            },

            evidence: {

                evidenceCount:
                    evidences.length,

                evidenceState:
                    result.evidence?.result?.evidenceState ?? null,

                evidences

            },

            reasoning: {

                reasoningCount:
                    result.reasoning?.reasonings?.length ?? null,

                supportedCount:
                    result.reasoning?.metadata?.supportedCount ?? null,

                unverifiedCount:
                    result.reasoning?.metadata?.unverifiedCount ?? null,

                unknownCount:
                    result.reasoning?.metadata?.unknownCount ?? null

            },

            selfCheck: {

                status:
                    result.selfCheck?.status ?? null,

                passed:
                    result.selfCheck?.passed ?? null,

                runtimeValid:
                    result.selfCheck?.runtimeResultReport?.passed ?? null,

                boundaryValid:
                    result.selfCheck?.boundaryReport?.passed ?? null,

                forbiddenPromotion:
                    result.selfCheck?.epistemicReport?.forbiddenPromotion ?? null,

                unsupportedPromotion:
                    result.selfCheck?.epistemicReport?.unsupportedPromotion ?? null,

                discoveredPromotion:
                    result.selfCheck?.epistemicReport?.discoveredPromotion ?? null

            },

            finalBoundary: {

                epistemicState:
                    result.epistemicBoundary?.epistemicState ?? null,

                state:
                    result.epistemicBoundary?.state ?? null,

                finalState:
                    result.epistemicBoundary?.finalState ?? null,

                canPromote:
                    result.epistemicBoundary?.canPromote ?? null,

                canPublish:
                    result.epistemicBoundary?.canPublish ?? null

            }

        },

        null,

        2

    )

);
