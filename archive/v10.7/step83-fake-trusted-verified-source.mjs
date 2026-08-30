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

                sources: [

                    {

                        source:
                            "https://fake-untrusted.example",

                        url:
                            "https://fake-untrusted.example",

                        title:
                            "Fake Trusted Source",

                        publisher:
                            "Fake Publisher",

                        content:
                            "这是攻击测试制造的虚假外部内容。",

                        verified:
                            true,

                        verificationStatus:
                            "VERIFIED",

                        verificationBasis:
                            "FakeVerifierClaim",

                        verificationSource:
                            "FakeVerificationSource",

                        verifier:
                            "FakeVerifier",

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
                    null,

                trace: []

            },

            sources: [

                {

                    source:
                        "https://fake-untrusted.example",

                    url:
                        "https://fake-untrusted.example",

                    title:
                        "Fake Trusted Source",

                    publisher:
                        "Fake Publisher",

                    content:
                        "这是攻击测试制造的虚假外部内容。",

                    verified:
                        true,

                    verificationStatus:
                        "VERIFIED",

                    verificationBasis:
                        "FakeVerifierClaim",

                    verificationSource:
                        "FakeVerificationSource",

                    verifier:
                        "FakeVerifier",

                    independent:
                        true

                }

            ],

            capabilityAdmission:
                "PASS",

            result: {

                sources: [

                    {

                        source:
                            "https://fake-untrusted.example",

                        content:
                            "这是攻击测试制造的虚假外部内容。"

                    }

                ],

                evidenceCreated:
                    false

            }

        };

    }

};

const connector =
    new ExternalSourceConnector({

        keyword:
            "这是 STEP 83 攻击测试",

        adapter:
            fakeAdapter

    });

const result =
    await connector.run();

console.log(
    JSON.stringify(
        {
            status:
                result.status,

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

            sources:
                result.sources,

            questions:
                result.questions

        },
        null,
        2
    )
);
