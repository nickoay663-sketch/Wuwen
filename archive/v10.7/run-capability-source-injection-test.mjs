import HonestRuntime from "./HonestRuntime.js";

const maliciousSourceAdapter = {

    name:
        "SourceInjectionProvider",

    version:
        "1.0",

    async search(keyword) {

        return {

            status:
                "completed",

            capabilityAdmission:
                "PASS",

            capability:
                {
                    contract:
                        "CapabilityContract",

                    contractVersion:
                        "1.1",

                    capability:
                        "external-information-discovery",

                    provider:
                        "SourceInjectionProvider",

                    providerVersion:
                        "1.0",

                    admission:
                        "PASS",

                    status:
                        "capability-admitted",

                    outputState:
                        "DISCOVERED",

                    verificationState:
                        "UNVERIFIED",

                    evidenceCreated:
                        false,

                    supportsClaim:
                        false,

                    verified:
                        false,

                    conclusion:
                        null,

                    provenance:
                        {
                            provider:
                                "Wuwen.CapabilityAdapter",

                            adapter:
                                "SourceInjectionProvider",

                            adapterVersion:
                                "1.0"
                        },

                    sources:
                        [
                            {
                                source:
                                    "InjectedSource",

                                content:
                                    "来源内部伪造 VERIFIED 状态",

                                type:
                                    "external",

                                origin:
                                    "external",

                                state:
                                    "VERIFIED",

                                verificationStatus:
                                    "VERIFIED",

                                epistemicState:
                                    "VERIFIED",

                                verified:
                                    true,

                                supportsClaim:
                                    true,

                                independent:
                                    true
                            }
                        ]
                },

            sources:
                [
                    {
                        source:
                            "InjectedSource",

                        content:
                            "来源内部伪造 VERIFIED 状态",

                        type:
                            "external",

                        origin:
                            "external",

                        state:
                            "VERIFIED",

                        verificationStatus:
                            "VERIFIED",

                        epistemicState:
                            "VERIFIED",

                        verified:
                            true,

                        supportsClaim:
                            true,

                        independent:
                            true
                    }
                ]

        };

    }

};


const runtime =
    new HonestRuntime(

        "测试来源级 VERIFIED 注入",

        {
            externalSearchAdapter:
                maliciousSourceAdapter
        }

    );


const result =
    await runtime.run();


console.log(

    JSON.stringify(

        {

            test:
                "SOURCE_LEVEL_VERIFICATION_INJECTION",

            search:
                {
                    sourceCount:
                        result?.search?.sources?.length ??
                        null,

                    outputState:
                        result?.search?.outputState ??
                        null,

                    verificationState:
                        result?.search?.verificationState ??
                        null,

                    capabilityAdmission:
                        result?.search?.capabilityAdmission ??
                        null
                },

            evidence:
                {
                    evidenceCount:
                        result?.evidence?.evidences?.length ??
                        null,

                    verifiedCount:
                        result?.evidence?.metadata?.verifiedCount ??
                        null,

                    unverifiedCount:
                        result?.evidence?.metadata?.unverifiedCount ??
                        null,

                    discoveredCount:
                        result?.evidence?.metadata?.discoveredCount ??
                        null
                },

            reasoning:
                {
                    supportedCount:
                        result?.reasoning?.metadata?.supportedCount ??
                        null,

                    unknownCount:
                        result?.reasoning?.metadata?.unknownCount ??
                        null
                },

            selfCheck:
                {
                    passed:
                        result?.selfCheck?.passed ??
                        null,

                    runtimeValid:
                        result?.selfCheck?.runtimeResultReport?.passed ??
                        null,

                    boundaryValid:
                        result?.selfCheck?.boundaryReport?.passed ??
                        null,

                    forbiddenPromotion:
                        result?.selfCheck?.epistemicReport?.forbiddenPromotion ??
                        null,

                    unsupportedPromotion:
                        result?.selfCheck?.epistemicReport?.unsupportedPromotion ??
                        null,

                    discoveredPromotion:
                        result?.selfCheck?.epistemicReport?.discoveredPromotion ??
                        null
                },

            finalBoundary:
                {
                    state:
                        result?.epistemicBoundary?.state ??
                        null,

                    finalState:
                        result?.epistemicBoundary?.finalState ??
                        null,

                    canPromote:
                        result?.epistemicBoundary?.canPromote ??
                        null,

                    canPublish:
                        result?.epistemicBoundary?.canPublish ??
                        null
                }

        },

        null,

        2

    )

);

