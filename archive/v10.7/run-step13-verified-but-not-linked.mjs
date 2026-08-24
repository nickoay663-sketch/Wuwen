import HonestRuntime from "./HonestRuntime.js";

const runtime = new HonestRuntime(
    "这是一个已经被验证，但尚未建立有效对应关系的事实",
    {
        evidence: [
            {
                type: "external",

                source:
                    "https://example.com/verified-but-not-linked",

                content:
                    "这是一个已经被验证，但尚未建立有效对应关系的事实",

                origin:
                    "step-13-test",

                independent:
                    true,

                /*
                 * 关键：
                 * 证据本身已经通过 Runtime 验证，
                 * 但明确声明它不支持当前 Claim。
                 */
                supportsClaim:
                    false,

                runtimeVerification:
                    true,

                runtimeVerificationRecord:
                    true,

                verificationBasis:
                    "step-13-runtime-verification",

                /*
                 * 故意保持没有有效 Correspondence。
                 */
                correspondenceLinked:
                    false,

                linkedToClaim:
                    false
            }
        ]
    }
);

const result =
    await runtime.run();

console.log(
    JSON.stringify(
        {
            executionComplete:
                result.metadata?.executionComplete,

            executionPending:
                result.metadata?.executionPending,

            selfCheckPassed:
                result.selfCheck?.result?.passed,

            selfCheckStatus:
                result.selfCheck?.result?.status,

            publicationBoundary:
                result.selfCheck?.result?.auditTrail
                    ?.publicationBoundary,

            publicationBoundaryStatus:
                result.selfCheck?.result?.auditTrail
                    ?.publicationBoundaryStatus,

            epistemicBoundaryStatus:
                result.selfCheck?.result?.auditTrail
                    ?.epistemicBoundaryStatus,

            epistemicStates:
                result.selfCheck?.result?.auditTrail
                    ?.epistemicStates,

            invalidEpistemicStates:
                result.selfCheck?.result?.auditTrail
                    ?.invalidEpistemicStates,

            declaredEpistemicStates:
                result.selfCheck?.result?.auditTrail
                    ?.declaredEpistemicStates,

            auditTrail:
                result.selfCheck?.result?.auditTrail
        },
        null,
        2
    )
);
