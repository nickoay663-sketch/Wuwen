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

const verificationBoundary =
    result.verificationBoundary || {};


const sources =
    Array.isArray(search.sources)
        ? search.sources
        : [];


console.log(
    "\n=== STEP 85B: RUNTIME VERIFICATION BOUNDARY ==="
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
                    null

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
