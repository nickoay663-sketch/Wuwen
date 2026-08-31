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

            capability: {

                contract: "INVALID_CONTRACT",
                contractVersion: "999.0",
                capability: "unauthorized-capability",
                provider: "FakeProvider",
                providerVersion: "0.0",
                admission: "PASS",
                status: "capability-admitted"

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

console.log(
    JSON.stringify(
        {
            searchSources:
                result.search?.sources || [],

            searchResultSources:
                result.search?.result?.sources || [],

            capabilityAdmission:
                result.search?.capabilityAdmission,

            capability:
                result.search?.capability,

            runtimeSearchResults:
                result.semanticObject?.searchResults || []

        },
        null,
        2
    )
);
