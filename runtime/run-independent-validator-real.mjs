import HonestRuntime from "./HonestRuntime.js";
import MWALResponsibilityInterface from "./MWALResponsibilityInterface.js";
import MWALIndependentValidator from "./MWALIndependentValidator.js";

const originalExpression = "这是一个事实";

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
    MWALResponsibilityInterface
        .fromResponsibilityEvent(event);

const validator =
    new MWALIndependentValidator();

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
