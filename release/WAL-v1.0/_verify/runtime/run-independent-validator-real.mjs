import HonestRuntime from "./HonestRuntime.js";
import WALResponsibilityInterface from "./WALResponsibilityInterface.js";
import WALIndependentValidator from "./WALIndependentValidator.js";

const originalExpression = "这是一个事实。";

const runtime =
    new HonestRuntime(originalExpression);

const result =
    await runtime.run();

const event =
    result?.responsibilityEvent;

if (!event) {
    throw new Error(
        "ResponsibilityEvent missing from real Runtime result."
    );
}

const envelope =
    WALResponsibilityInterface
        .fromResponsibilityEvent(event);

const validator =
    new WALIndependentValidator();

const validation =
    validator.validateEnvelope(
        envelope,
        originalExpression,
        result.testimony,
        event
    );

console.log(
    JSON.stringify(
        validation,
        null,
        2
    )
);
