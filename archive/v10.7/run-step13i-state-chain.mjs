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

function pick(obj, keys) {

    const source =
        obj?.result ||
        obj ||
        {};

    const output = {};

    for (const key of keys) {
        output[key] = source?.[key];
    }

    return output;
}

console.log(
    JSON.stringify(
        {

            STEP_1_Evidence: pick(
                result.evidence,
                [
                    "status",
                    "verificationStatus",
                    "epistemicState",
                    "evidenceCount",
                    "verifiedEvidenceCount"
                ]
            ),

            STEP_2_Correspondence: pick(
                result.correspondence,
                [
                    "status",
                    "verificationStatus",
                    "epistemicState",
                    "supported",
                    "matched",
                    "evidenceCount",
                    "verifiedEvidenceCount",
                    "supportingVerifiedEvidenceCount",
                    "verifiedButNotLinkedEvidenceCount",
                    "responsibilityBoundary",
                    "knowledgeBoundary"
                ]
            ),

            STEP_3_Reasoning: pick(
                result.reasoning,
                [
                    "status",
                    "verificationStatus",
                    "epistemicState",
                    "supported",
                    "reasoningLeap",
                    "assumptions",
                    "strength",
                    "state"
                ]
            ),

            STEP_4_Responsibility: pick(
                result.responsibility,
                [
                    "status",
                    "verificationStatus",
                    "epistemicState",
                    "supported",
                    "state",
                    "responsibilityBoundary"
                ]
            ),

            STEP_5_Reconstruction: pick(
                result.reconstruction,
                [
                    "status",
                    "verificationStatus",
                    "epistemicState",
                    "supported",
                    "state",
                    "publishable"
                ]
            ),

            STEP_6_Generator: pick(
                result.generator,
                [
                    "status",
                    "verificationStatus",
                    "epistemicState",
                    "supported",
                    "state",
                    "publishable"
                ]
            ),

            STEP_7_SelfCheck: {
                passed:
                    result.selfCheck?.result?.passed,

                publicationBoundaryStatus:
                    result.selfCheck?.result
                        ?.auditTrail
                        ?.publicationBoundaryStatus,

                epistemicBoundaryStatus:
                    result.selfCheck?.result
                        ?.auditTrail
                        ?.epistemicBoundaryStatus,

                epistemicStates:
                    result.selfCheck?.result
                        ?.auditTrail
                        ?.epistemicStates
            }

        },
        null,
        2
    )
);
