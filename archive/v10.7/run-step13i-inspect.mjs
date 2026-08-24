import HonestRuntime from "./HonestRuntime.js";

const runtime = new HonestRuntime(
    "这是一个已经被验证，但尚未建立有效对应关系的事实",
    {
        evidence: [
            {
                type: "external",
                source: "https://example.com/verified-but-not-linked",
                content: "这是一个已经被验证，但尚未建立有效对应关系的事实",
                origin: "step-13-test",
                independent: true,
                supportsClaim: true,

                runtimeVerification: true,
                runtimeVerificationRecord: true,

                verificationBasis:
                    "step-13-runtime-verification",

                correspondenceLinked: false,
                linkedToClaim: false
            }
        ]
    }
);

const result = await runtime.run();

const correspondence =
    result.correspondence?.result ||
    result.correspondence ||
    {};

const reasoning =
    result.reasoning?.result ||
    result.reasoning ||
    {};

const responsibility =
    result.responsibility?.result ||
    result.responsibility ||
    {};

const reconstruction =
    result.reconstruction?.result ||
    result.reconstruction ||
    {};

const generator =
    result.generator?.result ||
    result.generator ||
    {};

console.log(
    JSON.stringify(
        {
            correspondence: {
                status:
                    correspondence.status,

                verificationStatus:
                    correspondence.verificationStatus,

                epistemicState:
                    correspondence.epistemicState,

                supported:
                    correspondence.supported,

                matched:
                    correspondence.matched,

                evidenceCount:
                    correspondence.evidenceCount,

                verifiedEvidenceCount:
                    correspondence.verifiedEvidenceCount,

                supportingVerifiedEvidenceCount:
                    correspondence.supportingVerifiedEvidenceCount,

                verifiedButNotLinkedEvidenceCount:
                    correspondence.verifiedButNotLinkedEvidenceCount,

                sourceAvailable:
                    correspondence.sourceAvailable,

                verifiedSourceAvailable:
                    correspondence.verifiedSourceAvailable,

                responsibilityBoundary:
                    correspondence.responsibilityBoundary
            },

            reasoning: {
                verificationStatus:
                    reasoning.verificationStatus,

                epistemicState:
                    reasoning.epistemicState,

                supported:
                    reasoning.supported,

                reasoningLeap:
                    reasoning.reasoningLeap,

                assumptions:
                    reasoning.assumptions,

                strength:
                    reasoning.strength
            },

            responsibility: {
                verificationStatus:
                    responsibility.verificationStatus,

                epistemicState:
                    responsibility.epistemicState,

                supported:
                    responsibility.supported,

                state:
                    responsibility.state,

                responsibilityBoundary:
                    responsibility.responsibilityBoundary
            },

            reconstruction: {
                state:
                    reconstruction.state,

                verificationStatus:
                    reconstruction.verificationStatus,

                epistemicState:
                    reconstruction.epistemicState,

                publishable:
                    reconstruction.publishable
            },

            generator: {
                state:
                    generator.state,

                verificationStatus:
                    generator.verificationStatus,

                epistemicState:
                    generator.epistemicState,

                publishable:
                    generator.publishable
            }
        },
        null,
        2
    )
);
