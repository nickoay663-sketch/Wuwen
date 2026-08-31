import HonestRuntime from "./HonestRuntime.js";

const fakeAdapter = {

    name:
        "TrustedProvider",

    version:
        "1.0",

    async search() {

        return {

            status:
                "search-completed",

            sources: [

                {

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

                }

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

const verificationBoundary =
    result.verificationBoundary || {};

const sources =
    Array.isArray(search.sources)
        ? search.sources
        : [];


console.log(
    "\n=== STEP 86: FULL RUNTIME EXTERNAL VERIFIED CLAIM ATTACK ==="
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
                    search.status ||
                    null,

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

                verificationState:
                    evidence.result?.verificationState ||
                    evidence.metadata?.verificationState ||
                    null,

                evidenceCreated:
                    evidence.result?.evidenceCreated === true ||
                    evidence.metadata?.evidenceCreated === true,

                verifiedEvidenceCount:
                    evidence.result?.verifiedEvidenceCount ??
                    evidence.metadata?.verifiedEvidenceCount ??
                    null,

                epistemicState:
                    evidence.result?.epistemicState ||
                    evidence.metadata?.epistemicState ||
                    null

            },

            correspondence: {

                status:
                    correspondence.status ||
                    null,

                supported:
                    correspondence.result?.supported === true ||
                    correspondence.metadata?.supported === true,

                verificationState:
                    correspondence.result?.verificationState ||
                    correspondence.metadata?.verificationState ||
                    null

            },

            reasoning: {

                status:
                    reasoning.status ||
                    null,

                epistemicState:
                    reasoning.result?.epistemicState ||
                    reasoning.metadata?.epistemicState ||
                    null,

                supported:
                    reasoning.result?.supported === true ||
                    reasoning.metadata?.supported === true,

                verifiedEvidenceCount:
                    reasoning.result?.verifiedEvidenceCount ??
                    reasoning.metadata?.verifiedEvidenceCount ??
                    null

            },

            responsibility: {

                status:
                    responsibility.status ||
                    null,

                epistemicState:
                    responsibility.result?.epistemicState ||
                    responsibility.metadata?.epistemicState ||
                    null,

                supported:
                    responsibility.result?.supported === true ||
                    responsibility.metadata?.supported === true,

                publishable:
                    responsibility.result?.publishable === true ||
                    responsibility.metadata?.publishable === true

            },

            selfCheck: {

                status:
                    selfCheck.status ||
                    null,

                passed:
                    selfCheck.result?.passed === true ||
                    selfCheck.metadata?.passed === true,

                violations:
                    selfCheck.result?.violations ||
                    selfCheck.metadata?.violations ||
                    []

            },

            verificationBoundary,

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
