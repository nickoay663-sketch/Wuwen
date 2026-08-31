import HonestRuntime from "./HonestRuntime.js";

const runtimeVerificationSource = {

    source:
        "RuntimeVerifiedSource",

    content:
        "这是一个由 Runtime 验证记录支持当前定义的测试事实",

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
        "WuwenRuntime",

    supportsClaim:
        true

};

const runtime =
    new HonestRuntime(
        "这是一个由 Runtime 验证记录支持当前定义的测试事实",
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
                "REAL_RUNTIME_VERIFICATION_SUPPORTED_POSITIVE",

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

            correspondence: {

                verificationStatus:
                    result.correspondence?.correspondences?.[0]?.verificationStatus ?? null,

                epistemicState:
                    result.correspondence?.correspondences?.[0]?.epistemicState ?? null,

                supported:
                    result.correspondence?.correspondences?.[0]?.supported ?? null

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
