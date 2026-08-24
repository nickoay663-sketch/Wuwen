import HonestRuntime from "./HonestRuntime.js";

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

async function runCase(name, input, options) {

    const runtime =
        new HonestRuntime(
            input,
            options
        );

    const result =
        await runtime.run();

    const metadata =
        result.metadata ?? {};

    const externalEvidence =
        result.evidence?.evidences?.find(
            evidence =>
                evidence.type === "external"
        );

    const executionComplete =
        metadata.executionComplete === true;

    const executionPending =
        metadata.executionPending;

    assert(
        metadata.runtimeState === "RuntimeClosed",
        `${name}: runtimeState is not RuntimeClosed`
    );

    assert(
        executionComplete,
        `${name}: executionComplete is not true`
    );

    assert(
        Array.isArray(executionPending) &&
        executionPending.length === 0,
        `${name}: executionPending is not []`
    );

    return {
        name,

        runtimeState:
            metadata.runtimeState,

        epistemicState:
            result.epistemicState,

        publishable:
            result.responsibilityEventPublishable,

        externalVerificationClaim:
            externalEvidence?.externalVerificationClaim ?? false,

        runtimeVerificationRecord:
            externalEvidence?.runtimeVerificationRecord ?? false,

        executionComplete,

        executionPending
    };
}

try {

    console.log(
        "\n=== MoWen Runtime Verification Regression ==="
    );

    const positive =
        await runCase(
            "POSITIVE",
            "这是一个经过 Runtime 验证支持的事实",
            {
                evidence: [
                    {
                        type: "external",

                        source:
                            "https://example.com/verified-evidence",

                        content:
                            "这是一个经过 Runtime 验证支持的事实",

                        origin:
                            "external-test",

                        independent:
                            true,

                        supportsClaim:
                            true,

                        runtimeVerification:
                            true,

                        runtimeVerificationRecord:
                            true,

                        verificationBasis:
                            "positive-test-runtime-verification"
                    }
                ]
            }
        );

    assert(
        positive.epistemicState === "SUPPORTED",
        "POSITIVE: expected SUPPORTED"
    );

    assert(
        positive.publishable === true,
        "POSITIVE: expected publishable=true"
    );

    assert(
        positive.runtimeVerificationRecord === true,
        "POSITIVE: Runtime verification record missing"
    );

    const negative =
        await runCase(
            "NEGATIVE",
            "这是一个未经 Runtime 验证的事实",
            {
                evidence: [
                    {
                        type: "external",

                        source:
                            "https://example.com/unverified-evidence",

                        content:
                            "这是一个未经 Runtime 验证的事实",

                        origin:
                            "negative-test",

                        independent:
                            true,

                        supportsClaim:
                            true
                    }
                ]
            }
        );

    assert(
        negative.epistemicState === "UNVERIFIED",
        "NEGATIVE: expected UNVERIFIED"
    );

    assert(
        negative.publishable === false,
        "NEGATIVE: expected publishable=false"
    );

    assert(
        negative.runtimeVerificationRecord === false,
        "NEGATIVE: unexpected Runtime verification record"
    );

    const fakeVerification =
        await runCase(
            "FAKE VERIFICATION",
            "这是一个声称已经经过 Runtime 验证，但实际上没有 Runtime 验证记录的事实",
            {
                evidence: [
                    {
                        type: "external",

                        source:
                            "https://example.com/fake-verified-evidence",

                        content:
                            "这是一个声称已经经过 Runtime 验证，但实际上没有 Runtime 验证记录的事实",

                        origin:
                            "negative-test",

                        independent:
                            true,

                        supportsClaim:
                            true,

                        externalVerificationClaim:
                            true,

                        externalVerificationBasis:
                            "external-source-claims-runtime-verification"
                    }
                ]
            }
        );

    assert(
        fakeVerification.epistemicState === "UNVERIFIED",
        "FAKE VERIFICATION: expected UNVERIFIED"
    );

    assert(
        fakeVerification.publishable === false,
        "FAKE VERIFICATION: expected publishable=false"
    );

    assert(
        fakeVerification.externalVerificationClaim === true,
        "FAKE VERIFICATION: externalVerificationClaim was not preserved"
    );

    assert(
        fakeVerification.runtimeVerificationRecord === false,
        "FAKE VERIFICATION: forged Runtime verification was accepted"
    );

    const results = [
        positive,
        negative,
        fakeVerification
    ];

    console.log(
        JSON.stringify(
            results,
            null,
            2
        )
    );

    console.log(
        "\n=== REGRESSION RESULT: PASS ==="
    );

    console.log(
        "Positive: SUPPORTED / publishable=true / RuntimeVerificationRecord=true"
    );

    console.log(
        "Negative: UNVERIFIED / publishable=false / RuntimeVerificationRecord=false"
    );

    console.log(
        "Fake Verification: UNVERIFIED / publishable=false / ExternalClaim=true / RuntimeVerificationRecord=false"
    );

    console.log(
        "All executions: RuntimeClosed / complete / executionPending=[]"
    );

} catch (error) {

    console.error(
        "\n=== REGRESSION RESULT: FAIL ==="
    );

    console.error(
        error.message
    );

    process.exitCode = 1;
}
