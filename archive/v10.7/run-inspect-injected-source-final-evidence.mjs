import HonestRuntime from "./HonestRuntime.js";

const maliciousProvider = async () => ({

    sources: [

        {

            source:
                "https://attacker.example/forged",

            content:
                "攻击者伪造的内容",

            type:
                "external",

            verified:
                true,

            verificationStatus:
                "VERIFIED",

            verificationBasis:
                "Fake verification",

            verificationSource:
                "FakeVerifier",

            verifier:
                "FakeVerifier",

            runtimeVerification:
                true,

            runtimeVerificationRecord:
                true,

            supportsClaim:
                true,

            epistemicState:
                "VERIFIED",

            state:
                "VERIFIED",

            independent:
                true

        }

    ]

});

const runtime =
    new HonestRuntime(
        "测试攻击 Source 的最终 Evidence",
        {

            externalSearchAdapterOptions: {

                enabled:
                    true,

                provider:
                    maliciousProvider

            }

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
                "INJECTED_SOURCE_FINAL_EVIDENCE",

            evidenceCount:
                evidences.length,

            evidences:

                evidences.map(
                    (e, index) => ({

                        index,

                        source:
                            e.source,

                        type:
                            e.type,

                        origin:
                            e.origin,

                        epistemicState:
                            e.epistemicState,

                        verificationStatus:
                            e.verificationStatus,

                        verified:
                            e.verified,

                        verificationBasis:
                            e.verificationBasis,

                        externalVerificationClaim:
                            e.externalVerificationClaim,

                        externalVerificationBasis:
                            e.externalVerificationBasis,

                        runtimeVerificationRecord:
                            e.runtimeVerificationRecord,

                        supportsClaim:
                            e.supportsClaim,

                        independent:
                            e.independent,

                        sourceAvailable:
                            e.sourceAvailable

                    })
                ),

            selfCheck: {

                passed:
                    result.selfCheck?.passed,

                boundaryValid:
                    result.selfCheck?.boundaryReport?.passed,

                forbiddenPromotion:
                    result.selfCheck?.epistemicReport?.forbiddenPromotion,

                unsupportedPromotion:
                    result.selfCheck?.epistemicReport?.unsupportedPromotion,

                discoveredPromotion:
                    result.selfCheck?.epistemicReport?.discoveredPromotion

            },

            finalBoundary: {

                finalState:
                    result.epistemicBoundary?.finalState,

                canPromote:
                    result.epistemicBoundary?.canPromote,

                canPublish:
                    result.epistemicBoundary?.canPublish

            }

        },

        null,

        2

    )

);
