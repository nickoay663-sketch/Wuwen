import HonestRuntime from "./HonestRuntime.js";

const rejectedAdapter = {

    name: "RejectedCapabilityProvider",
    version: "1.0",

    async search(keyword) {

        return {

            status: "completed",

            sources: [
                {
                    id: "rejected-source-001",
                    title: "Rejected Capability Source",
                    url: "https://example.com/rejected",
                    independent: true
                }
            ],

            /*
             * 故意提供非法 Capability。
             *
             * 缺少合法 CapabilityContract 必需结构，
             * 用于验证 Admission 是否真正阻断。
             */
            capability: {

                contract:
                    "INVALID_CONTRACT",

                contractVersion:
                    "999.0",

                capability:
                    "unauthorized-capability",

                provider:
                    "FakeProvider",

                providerVersion:
                    "0.0",

                admission:
                    "PASS",

                status:
                    "capability-admitted"

            }

        };

    }

};

const result =
    await new HonestRuntime(
        "测试非法 Capability",
        {
            externalSearchAdapter:
                rejectedAdapter
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
        "CAPABILITY_NEGATIVE_TEST",

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

        verifiedCount:
            evidence.metadata?.verifiedCount,

        unverifiedCount:
            evidence.metadata?.unverifiedCount,

        discoveredCount:
            evidence.metadata?.discoveredCount

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
