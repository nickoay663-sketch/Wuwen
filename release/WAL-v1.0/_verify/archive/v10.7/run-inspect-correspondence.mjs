import HonestRuntime from "./HonestRuntime.js";

const source = {
    source: "RuntimeVerifiedSource",
    content: "这是一个由 Runtime 验证记录支持当前定义的测试事实",
    type: "runtime-verification",
    origin: "runtime",
    independent: true,
    runtimeVerificationRecord: true,
    runtimeVerification: true,
    verificationBasis: "RuntimeVerificationTest",
    verificationSource: "RuntimeVerificationEngine",
    verifier: "WuwenRuntime",
    supportsClaim: true
};

const runtime = new HonestRuntime(
    "这是一个由 Runtime 验证记录支持当前定义的测试事实",
    {
        searchResults: [source],
        evidence: [source]
    }
);

const result = await runtime.run();

const c = result.correspondence || {};

console.log(JSON.stringify({
    type: typeof c,
    keys: Object.keys(c),
    status: c.status ?? null,
    metadata: c.metadata ?? null,
    correspondences: Array.isArray(c.correspondences)
        ? c.correspondences
        : null,
    resultKeys:
        c.result && typeof c.result === "object"
            ? Object.keys(c.result)
            : null,
    result: c.result
        ? {
            keys: Object.keys(c.result),
            correspondences: Array.isArray(c.result.correspondences)
                ? c.result.correspondences
                : null,
            epistemicBoundary: c.result.epistemicBoundary ?? null
        }
        : null
}, null, 2));
