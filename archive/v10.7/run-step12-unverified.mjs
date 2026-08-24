import HonestRuntime from "./HonestRuntime.js";

const runtime = new HonestRuntime(
    "这是一个未经 Runtime 验证支持的事实",
    {
        evidence: [
            {
                type: "external",
                source: "https://example.com/unverified-evidence",
                content: "这是一个未经 Runtime 验证支持的事实",
                origin: "step-12-test",
                independent: true,
                supportsClaim: true,
                runtimeVerification: false,
                runtimeVerificationRecord: false
            }
        ]
    }
);

const result = await runtime.run();

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

            auditTrail:
                result.selfCheck?.result?.auditTrail
        },
        null,
        2
    )
);
