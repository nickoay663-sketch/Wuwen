import HonestRuntime from "./HonestRuntime.js";
import CapabilityContract from "./CapabilityContract.js";

const adapter = {

    name:
        "TestCapabilityProvider",

    version:
        "1.0",

    async search(keyword) {

        const capability =
            CapabilityContract.createResponse({

                capability:
                    "external-information-discovery",

                provider:
                    "TestCapabilityProvider",

                providerVersion:
                    "1.0",

                status:
                    "completed",

                output:
                    {
                        keyword,
                        message:
                            "这是外部能力提供的发现结果，不是验证结论。"
                    },

                sources: [

                    {
                        id:
                            "test-source-001",

                        title:
                            "Capability Test Source",

                        url:
                            "https://example.com/test-source",

                        independent:
                            true

                    }

                ],

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
                    null

            });

        return {

            status:
                "completed",

            sources:
                capability.sources,

            capability

        };

    }

};


const runtime =
    new HonestRuntime(

        "测试一个外部 Capability 是否能够进入勿问 Runtime",

        {

            externalSearchAdapter:
                adapter

        }

    );


const result =
    await runtime.run();


const search =
    result.search || {};

const evidence =
    result.evidence || {};

const reasoning =
    result.reasoning || {};

const selfCheck =
    result.selfCheck || {};


console.log(
    JSON.stringify(

        {

            test:
                "MINIMAL_CAPABILITY_POSITIVE_TEST",

            runtimeVersion:
                result.runtimeVersion || null,

            pipelineLength:
                Array.isArray(result.pipeline)
                    ? result.pipeline.length
                    : null,

            runtimeTraceLength:
                Array.isArray(result.runtimeTrace)
                    ? result.runtimeTrace.length
                    : null,

            search: {

                status:
                    search.status || null,

                sourceCount:
                    search.sourceCount ?? null,

                outputState:
                    search.outputState || null,

                verificationState:
                    search.verificationState || null,

                capabilityAdmission:
                    search.capabilityAdmission || null,

                capability:
                    search.capability || null

            },

            evidence: {

                status:
                    evidence.status || null,

                evidenceCount:
                    evidence.evidenceCount ?? null,

                verifiedEvidenceCount:
                    evidence.verifiedEvidenceCount ?? null,

                verificationState:
                    evidence.verificationState || null

            },

            reasoning: {

                status:
                    reasoning.status || null,

                epistemicState:
                    reasoning.epistemicState || null,

                supported:
                    reasoning.supported ?? null

            },

            selfCheck: {

                status:
                    selfCheck.status || null,

                passed:
                    selfCheck.passed ?? null,

                runtimeValid:
                    selfCheck.runtimeValid ?? null

            },

            finalBoundary: {

                epistemicState:
                    result.epistemicState || null,

                epistemicBoundary:
                    result.epistemicBoundary || null,

                runtimeState:
                    result.runtimeState || null

            }

        },

        null,

        2

    )
);
