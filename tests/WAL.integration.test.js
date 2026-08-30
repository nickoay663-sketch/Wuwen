import HonestRuntime from "../runtime/HonestRuntime.js";
import WALResponsibilityInterface from "../runtime/WALResponsibilityInterface.js";

const runtime =
    new HonestRuntime("杩欐槸涓€涓簨瀹?);

const result =
    await runtime.run();

const event =
    result?.responsibilityEvent;

console.log(
    JSON.stringify(
        {
            runtimeState:
                result?.metadata?.runtimeState,

            executionComplete:
                result?.metadata?.executionComplete,

            executionCompletedCount:
                result?.metadata?.executionCompletedCount,

            executionExpectedCount:
                result?.metadata?.executionExpectedCount,

            selfCheckPassed:
                result?.epistemicBoundary?.selfCheckPassed,

            responsibilityEventExists:
                !!event,

            responsibilityEvent:
                event
                    ? {
                        type:
                            event.type,

                        version:
                            event.version,

                        expression:
                            event.expression,

                        epistemicState:
                            event.epistemicState,

                        verificationStatus:
                            event.verificationStatus,

                        supported:
                            event.supported,

                        responsibilityBoundary:
                            event.responsibilityBoundary
                    }
                    : null
        },
        null,
        2
    )
);

if (!event) {

    throw new Error(
        "WAL integration failed: ResponsibilityEvent was not produced."
    );

}

const envelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(event);

const validation =
    WALResponsibilityInterface
        .validate(envelope);

const propagation =
    WALResponsibilityInterface
        .canPropagate(envelope);

const verificationRequired =
    WALResponsibilityInterface
        .requiresVerification(envelope);

console.log(
    JSON.stringify(
        {
            WALEnvelope:
                envelope,

            validation,

            propagation,

            verificationRequired,

            interfaceContract:
                WALResponsibilityInterface.contract()
        },
        null,
        2
    )
);

if (
    validation?.valid !== true
) {

    throw new Error(
        `WAL integration failed: envelope validation failed: ${JSON.stringify(
            validation
        )}`
    );

}

console.log(
    "\n=== WAL REAL INTEGRATION TEST PASSED ==="
);
