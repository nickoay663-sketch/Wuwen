import MWALIndependentValidator from "./MWALIndependentValidator.js";

class MWALGatekeeper {

    constructor(options = {}) {

        this.name =
            "MWAL Runtime Gatekeeper";

        this.version =
            "1.0";

        this.validator =
            options.validator ||
            new MWALIndependentValidator();

    }

    intercept(
        envelope = {},
        originalExpression = undefined,
        testimony = undefined,
        responsibilityEvent = undefined
    ) {

        const validation =
            this.validator.validateEnvelope(
                envelope,
                originalExpression,
                testimony,
                responsibilityEvent
            );

        if (validation.passed !== true) {

            return {
                decision: "REFUSE",
                allowed: false,
                status: "BLOCKED",
                reason: "MWAL_VALIDATION_FAILED",
                validation
            };

        }

        if (
            !responsibilityEvent ||
            typeof responsibilityEvent.isPublishable !== "function"
        ) {

            return {
                decision: "REFUSE",
                allowed: false,
                status: "BLOCKED",
                reason: "PUBLICATION_AUTHORITY_UNAVAILABLE",
                validation
            };

        }

        const publishable =
            responsibilityEvent.isPublishable();

        if (publishable !== true) {

            return {
                decision: "REFUSE",
                allowed: false,
                status: "BLOCKED",
                reason: "PUBLICATION_NOT_AUTHORIZED",
                validation
            };

        }

        return {
            decision: "ALLOW",
            allowed: true,
            status: "PASSED",
            reason: "MWAL_PUBLICATION_AUTHORIZED",
            validation
        };

    }

}

export default MWALGatekeeper;
