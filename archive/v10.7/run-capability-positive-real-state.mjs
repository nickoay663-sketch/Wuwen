import HonestRuntime from "./HonestRuntime.js";
import CapabilityContract from "./CapabilityContract.js";

const adapter = {

    name: "TestCapabilityProvider",
    version: "1.0",

    async search(keyword) {

        return {

            status: "completed",

            sources: [
                {
                    id: "test-source-001",
                    title: "Capability Test Source",
                    url: "https://example.com/test-source",
                    independent: true
                }
            ],

            capability:
                CapabilityContract.createResponse({

                    capability:
                        "external-information-discovery",

                    provider:
                        "TestCapabilityProvider",

                    providerVersion:
                        "1.0",

                    output:
                        {
                            keyword
                        },

                    sources: [
                        {
                            id: "test-source-001",
                            title: "Capability Test Source",
                            url: "https://example.com/test-source",
                            independent: true
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
                        false

                })

        };

    }

};

const result =
    await new HonestRuntime(
        "测试外部 Capability",
        {
            externalSearchAdapter:
                adapter
        }
    ).run();

const search =
    result.search || {};

const evidence =
    result.evidence || {};

const reasoning =
    result.reasoning || {};

const selfCheck =
    result.selfCheck || {};

const boundary =
    result.epistemicBoundary || {};

const report = {

    test:
        "CAPABILITY_POSITIVE_REAL_STATE",

    runtimeVersion:
        result.runtimeVersion,

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
            search.status,

        sourceCount:
            search.result?.sourceCount,

        sourcesLength:
            Array.isArray(search.sources)
                ? search.sources.length
                : null,

        outputState:
            search.result?.outputState,

        verificationState:
            search.result?.verificationState,

        evidenceCreated:
            search.result?.evidenceCreated,

        capabilityAdmission:
            search.capabilityAdmission,

        capability:
            search.capability

    },

    evidence: {

        status:
            evidence.status,

        evidenceCount:
            Array.isArray(evidence.evidences)
                ? evidence.evidences.length
                : null,

        evidenceState:
            evidence.result?.evidenceState,

        metadata:
            {

                evidenceCount:
                    evidence.metadata?.evidenceCount,

                verifiedCount:
                    evidence.metadata?.verifiedCount,

                unverifiedCount:
                    evidence.metadata?.unverifiedCount,

                discoveredCount:
                    evidence.metadata?.discoveredCount

            }

    },

    reasoning: {

        status:
            reasoning.status,

        reasoningCount:
            Array.isArray(reasoning.reasonings)
                ? reasoning.reasonings.length
                : null,

        supportedCount:
            reasoning.metadata?.supportedCount,

        unverifiedCount:
            reasoning.metadata?.unverifiedCount,

        unknownCount:
            reasoning.metadata?.unknownCount

    },

    selfCheck: {

        status:
            selfCheck.status,

        passed:
            selfCheck.passed,

        runtimeValid:
            selfCheck.runtimeResultReport?.passed,

        boundaryValid:
            selfCheck.epistemicReport?.boundaryValid,

        forbiddenPromotion:
            selfCheck.epistemicReport?.forbiddenPromotion,

        unsupportedPromotion:
            selfCheck.epistemicReport?.unsupportedPromotion,

        discoveredPromotion:
            selfCheck.epistemicReport?.discoveredPromotion

    },

    finalBoundary: {

        epistemicState:
            result.epistemicState,

        state:
            boundary.state,

        canPromote:
            boundary.canPromote,

        canPublish:
            boundary.canPublish,

        finalState:
            boundary.finalState,

        selfCheckPassed:
            boundary.selfCheckPassed

    }

};

console.log(
    JSON.stringify(
        report,
        null,
        2
    )
);
