import CapabilityContract from "./CapabilityContract.js";
import HonestRuntime from "./HonestRuntime.js";

const fakeAdapter = {

    name:
        "TrustedProvider",

    version:
        "1.0",

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


        return {

            status:
                "search-completed",

            capability:
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

                    sources: [

                        source

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

                    trace: [

                        {

                            engine:
                                "TrustedProvider",

                            action:
                                "external-search",

                            status:
                                "completed"

                        }

                    ]

                }),

            sources: [

                source

            ]

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

const evidence =
    result.evidence || {};

const correspondence =
    result.correspondence || {};

const reasoning =
    result.reasoning || {};

const responsibility =
    result.responsibility || {};

const selfCheck =
    result.selfCheck || {};

const sources =
    Array.isArray(search.sources)
        ? search.sources
        : [];


console.log(
    "\n=== STEP 86D: VALID CAPABILITY + EXTERNAL VERIFIED CLAIM ==="
);


console.log(
    JSON.stringify(

        {

            runtimeVersion:
                result.runtimeVersion,

            runtimeState:
                result.runtimeState,

            epistemicState:
                result.epistemicState,

            search: {

                status:
                    search.status,

                sourceCount:
                    sources.length,

                outputState:
                    search.result?.outputState ||
                    search.metadata?.outputState ||
                    null,

                verificationState:
                    search.result?.verificationState ||
                    search.metadata?.verificationState ||
                    null,

                capabilityAdmission:
                    search.capabilityAdmission ||
                    null

            },

            evidence: {

                status:
                    evidence.status ||
                    null,

                evidenceCreated:
                    evidence.result?.evidenceCreated === true ||
                    evidence.metadata?.evidenceCreated === true,

                verifiedEvidenceCount:
                    evidence.result?.verifiedEvidenceCount ??
                    evidence.metadata?.verifiedEvidenceCount ??
                    null

            },

            correspondence: {

                status:
                    correspondence.status ||
                    null,

                supported:
                    correspondence.result?.supported === true ||
                    correspondence.metadata?.supported === true

            },

            reasoning: {

                status:
                    reasoning.status ||
                    null,

                supported:
                    reasoning.result?.supported === true ||
                    reasoning.metadata?.supported === true,

                epistemicState:
                    reasoning.result?.epistemicState ||
                    reasoning.metadata?.epistemicState ||
                    null

            },

            responsibility: {

                status:
                    responsibility.status ||
                    null,

                supported:
                    responsibility.result?.supported === true ||
                    responsibility.metadata?.supported === true,

                publishable:
                    responsibility.result?.publishable === true ||
                    responsibility.metadata?.publishable === true,

                epistemicState:
                    responsibility.result?.epistemicState ||
                    responsibility.metadata?.epistemicState ||
                    null

            },

            selfCheck: {

                status:
                    selfCheck.status ||
                    null,

                passed:
                    selfCheck.passed === true,

                violations:
                    selfCheck.violations || []

            },

            sources:

                sources.map(
                    source => ({

                        source:
                            source.source ||
                            source.url ||
                            null,

                        externalVerificationClaim:
                            source.externalVerificationClaim === true,

                        externalVerificationBasis:
                            source.externalVerificationBasis ||
                            null,

                        verificationStatus:
                            source.verificationStatus ||
                            null,

                        verified:
                            source.verified === true,

                        runtimeVerificationRecord:
                            source.runtimeVerificationRecord === true,

                        supportsClaim:
                            source.supportsClaim === true

                    })
                )

        },

        null,

        2

    )
);

