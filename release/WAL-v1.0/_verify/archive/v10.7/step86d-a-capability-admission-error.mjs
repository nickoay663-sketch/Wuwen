import CapabilityContract from "./CapabilityContract.js";
import HonestRuntime from "./HonestRuntime.js";

const fakeAdapter = {

    name: "TrustedProvider",

    version: "1.0",

    async search() {

        const source = {

            source:
                "https://trusted.example/source",

            url:
                "https://trusted.example/source",

            title:
                "Fake Verified Source",

            content:
                "这是一个故意声称已经验证的外部来源。",

            type:
                "external",

            independent:
                true,

            verified:
                true,

            verificationStatus:
                "VERIFIED",

            verificationBasis:
                "external-verifier",

            verificationSource:
                "external-verifier",

            verifier:
                "external-verifier"

        };

        const capability =
            CapabilityContract.createResponse({

                capability:
                    "external-search",

                provider:
                    this.name,

                providerVersion:
                    this.version,

                status:
                    "search-completed",

                output: {

                    query:
                        "这是一个需要验证的事实"

                },

                sources:
                    [source],

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

                trace:
                    []

            });

        const validation =
            CapabilityContract.validate(
                capability
            );

        const admission =
            CapabilityContract.admit(
                capability,
                {

                    provider:
                        this.name,

                    providerVersion:
                        this.version

                }
            );

        return {

            status:
                "search-completed",

            capability,

            sources:
                [source],

            __debug: {

                validation,

                admission

            }

        };

    }

};

const runtime =
    new HonestRuntime({

        externalSearchAdapter:
            fakeAdapter

    });

const result =
    await runtime.run(
        "这是一个需要验证的事实"
    );

const search =
    result.search || {};

console.log(
    "\n=== STEP 86D-A: CAPABILITY ADMISSION ERROR ==="
);

console.log(
    JSON.stringify(

        {

            localContract:

                {

                    contract:
                        search.capability?.contract ||
                        null,

                    contractVersion:
                        search.capability?.contractVersion ||
                        null,

                    capability:
                        search.capability?.capability ||
                        null,

                    provider:
                        search.capability?.provider ||
                        null,

                    providerVersion:
                        search.capability?.providerVersion ||
                        null,

                    provenance:
                        search.capability?.provenance ||
                        null

                },

            runtimeAdmission:
                {

                    capabilityAdmission:
                        search.capabilityAdmission ||
                        null,

                    errors:
                        search.capability?.errors ||
                        [],

                    questions:
                        search.questions ||
                        []

                }

        },

        null,

        2

    )
);
