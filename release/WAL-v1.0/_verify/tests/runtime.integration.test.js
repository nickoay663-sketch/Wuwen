import HonestRuntime from "../runtime/HonestRuntime.js";


const runtime =
    new HonestRuntime(
        "这是一个事实输入。"
    );


const result =
    await runtime.run();


const metadata =
    result?.metadata || {};

const selfCheck =
    result?.selfCheck || {};

const epistemicBoundary =
    result?.epistemicBoundary || {};

const registry =
    result?.engineRegistry || {};

const pipeline =
    Array.isArray(
        result?.pipeline
    )
        ? result.pipeline
        : [];


const checks = {

    runtimeResultExists:
        !!result,

    runtimeClosed:
        metadata.runtimeState ===
        "RuntimeClosed",

    executionComplete:
        metadata.executionComplete ===
        true,

    executionCompleted11:
        metadata.executionCompletedCount === 11,

    executionExpected11:
        metadata.executionExpectedCount === 11,

    executionPendingZero:
        Array.isArray(
            metadata.executionPending
        ) &&
        metadata.executionPending.length ===
        0,

    registry11:
        metadata.engineCount === 11,

    registryValidationPassed:
        metadata.registryValidation?.passed ===
        true,

    registryVersionValidationPassed:
        metadata.registryVersionValidation?.passed ===
        true,

    selfCheckPassed:
        selfCheck?.result?.passed ===
        true,

    selfCheckStatus:
        selfCheck?.status ===
        "self-check-passed",

    epistemicBoundarySelfCheckPassed:
        epistemicBoundary.selfCheckPassed ===
        true,

    responsibilityEventExists:
        !!result?.responsibilityEvent,

    responsibilityEventValidationPassed:
        result?.responsibilityEventValidation?.passed ===
        true,

    pipelineComplete:
        Array.isArray(
            metadata.executionCompleted
        ) &&
        metadata.executionCompleted.length === 11,

    noPendingEngines:
        Array.isArray(
            metadata.executionPending
        ) &&
        metadata.executionPending.length ===
        0

};


const passed =
    Object.values(checks)
        .every(Boolean);


console.log(
    JSON.stringify(
        {

            test:
                "Wuwen Runtime v10.8 Full Integration Test",

            checks,

            result: {

                runtimeState:
                    metadata.runtimeState,

                engineCount:
                    metadata.engineCount,

                executionCompletedCount:
                    metadata.executionCompletedCount,

                executionExpectedCount:
                    metadata.executionExpectedCount,

                executionCompleted:
                    metadata.executionCompleted,

                executionPending:
                    metadata.executionPending,

                executionComplete:
                    metadata.executionComplete,

                selfCheckPassed:
                    selfCheck?.result?.passed,

                selfCheckStatus:
                    selfCheck?.status,

                finalEpistemicState:
                    result?.epistemicState,

                epistemicBoundarySelfCheckPassed:
                    epistemicBoundary.selfCheckPassed,

                responsibilityEvent:
                    !!result?.responsibilityEvent,

                responsibilityEventValidation:
                    result?.responsibilityEventValidation,

                registryEngineCount:
                    registry?.engines
                        ? Object.keys(
                            registry.engines
                        ).length
                        : metadata.engineCount

            }

        },
        null,
        2
    )
);


if (!passed) {

    console.log(
        "Wuwen Runtime v10.8 Full Integration Test Failed."
    );

    process.exit(1);

}


console.log(
    "Wuwen Runtime v10.8 Full Integration Test Passed."
);
