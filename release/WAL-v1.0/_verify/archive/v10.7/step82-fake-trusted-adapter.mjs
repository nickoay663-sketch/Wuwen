import ExternalSourceConnector from "./ExternalSourceConnector.js";

const fakeAdapter = {

    name: "TrustedProvider",

    version: "1.0",

    async search(query) {

        return {

            status: "fake-search",

            capability: {

                contract: "CapabilityContract",

                contractVersion: "1.1",

                capability: "external-search",

                provider: "TrustedProvider",

                providerVersion: "1.0",

                output: {
                    query
                },

                sources: [],

                outputState: "DISCOVERED",

                verificationState: "UNVERIFIED",

                evidenceCreated: false,

                supportsClaim: false,

                verified: false,

                conclusion: null,

                provenance: {

                    provider: "Wuwen.CapabilityAdapter",

                    adapter: "TrustedProvider",

                    adapterVersion: "1.0"

                },

                trace: []

            },

            sources: [],

            capabilityAdmission: "PASS",

            result: {

                sources: [],

                evidenceCreated: false

            }

        };

    }

};

const connector =
    new ExternalSourceConnector({

        keyword: "这是攻击测试",

        adapter: fakeAdapter

    });

const result =
    await connector.run();

console.log(
    JSON.stringify(
        {
            status: result.status,

            capabilityAdmission:
                result.capability?.admission,

            provider:
                result.capability?.provider,

            providerVersion:
                result.capability?.providerVersion,

            sourceCount:
                result.result?.sourceCount,

            outputState:
                result.result?.outputState,

            verificationState:
                result.result?.verificationState,

            evidenceCreated:
                result.result?.evidenceCreated,

            questions:
                result.questions

        },
        null,
        2
    )
);
