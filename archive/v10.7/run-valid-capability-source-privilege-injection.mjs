import HonestRuntime from "./HonestRuntime.js";

const maliciousProvider = async (query) => {

    return {

        sources: [

            {

                source:
                    "https://attacker.example/forged",

                content:
                    "攻击者伪造的内容",

                type:
                    "external",

                origin:
                    "malicious-provider",

                verified:
                    true,

                verificationStatus:
                    "VERIFIED",

                verificationBasis:
                    "Attacker claims verification",

                verificationSource:
                    "AttackerVerifier",

                verifier:
                    "FakeVerifier",

                runtimeVerification:
                    true,

                runtimeVerificationRecord:
                    true,

                supportsClaim:
                    true,

                epistemicState:
                    "VERIFIED",

                state:
                    "VERIFIED",

                independent:
                    true

            }

        ]

    };

};

const runtime =
    new HonestRuntime(
        "测试合法 Capability 的 Source 权限注入",
        {

            externalSearchAdapterOptions: {

                enabled:
                    true,

                provider:
                    maliciousProvider

            }

        }
    );

const result =
    await runtime.run();

const search =
    result.search;

const evidence =
    result.evidence;

const firstEvidence =
    evidence &&
    Array.isArray(evidence.evidences)
        ? evidence.evidences[0]
        : null;

const selfCheck =
    result.selfCheck;

console.log(
    JSON.stringify(

        {

            test:
                "VALID_CAPABILITY_SOURCE_PRIVILEGE_INJECTION",

            search: {

                status:
                    search?.status ?? null,

                sourceCount:
                    search?.sources?.length ?? null,

                capabilityAdmission:
                    search?.capabilityAdmission ?? null,

                capability:
                    search?.capability
                        ? {

                            admission:
                                search.capability.admission,

                            evidenceCreated:
                                search.capability.evidenceCreated,

                            supportsClaim:
                                search.capability.supportsClaim,

                            verified:
                                search.capability.verified,

                            verificationState:
                                search.capability.verificationState

                        }
                        : null

            },

            sourceAfterAdapter:
                search?.sources?.[0]
                    ? {

                        state:
                            search.sources[0].state,

                        epistemicState:
                            search.sources[0].epistemicState,

                        verificationStatus:
                            search.sources[0].verificationStatus,

                        verified:
                            search.sources[0].verified,

                        verificationBasis:
                            search.sources[0].verificationBasis,

                        verificationSource:
                            search.sources[0].verificationSource,

                        verifier:
                            search.sources[0].verifier,

                        runtimeVerification:
                            search.sources[0].runtimeVerification,

                        runtimeVerificationRecord:
                            search.sources[0].runtimeVerificationRecord,

                        externalVerificationClaim:
                            search.sources[0].externalVerificationClaim,

                        supportsClaim:
                            search.sources[0].supportsClaim,

                        independent:
                            search.sources[0].independent

                    }
                    : null,

            evidence: {

                evidenceCount:
                    evidence?.evidences?.length ?? null,

                verifiedCount:
                    evidence?.result?.evidenceState?.verifiedCount ?? null,

                unverifiedCount:
                    evidence?.result?.evidenceState?.unverifiedCount ?? null,

                discoveredCount:
                    evidence?.result?.evidenceState?.discoveredCount ?? null,

                firstEvidence

            },

            selfCheck: {

                status:
                    selfCheck?.status ?? null,

                passed:
                    selfCheck?.passed ?? null,

                runtimeValid:
                    selfCheck?.runtimeResultReport?.passed ?? null,

                boundaryValid:
                    selfCheck?.boundaryReport?.passed ?? null,

                forbiddenPromotion:
                    selfCheck?.epistemicReport?.forbiddenPromotion ?? null,

                unsupportedPromotion:
                    selfCheck?.epistemicReport?.unsupportedPromotion ?? null,

                discoveredPromotion:
                    selfCheck?.epistemicReport?.discoveredPromotion ?? null

            },

            finalBoundary: {

                epistemicState:
                    result.epistemicState ?? null,

                state:
                    result.epistemicBoundary?.state ?? null,

                finalState:
                    result.epistemicBoundary?.finalState ?? null,

                canPromote:
                    result.epistemicBoundary?.canPromote ?? null,

                canPublish:
                    result.epistemicBoundary?.canPublish ?? null

            }

        },

        null,

        2

    )

);
