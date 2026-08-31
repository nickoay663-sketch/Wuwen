import RuntimeContract from "./RuntimeContract.js";

class RuntimeResult {

    constructor() {

        this.runtimeVersion =
            RuntimeContract.identity?.runtimeVersion ||
            RuntimeContract.version ||
            "10.8";

        this.generatedAt =
            new Date().toISOString();

        this.metadata = {};

        this.recognition = {};
        this.definition = {};
        this.testimony = {};
        this.testimonyValidation = {};
        this.search = {};
        this.evidence = {};
        this.runtimeVerification = {};
        this.correspondence = {};
        this.reasoning = {};
        this.responsibility = {};
        this.responsibilityModel = {};
        this.reconstruction = {};
        this.generator = {};
        this.selfCheck = {};

        this.engineRegistry = [];

        this.testimonyChain = {};

        this.verificationBoundary = {};

        this.identity = {};

        this.contract =
            RuntimeContract;

        this.semanticObject = {};

        this.runtimeTrace = [];

        this.pipeline = [];

        /*
         * ---------------------------------------------------------
         * Final Runtime State
         * ---------------------------------------------------------
         */

        this.epistemicState =
            "UNKNOWN";

        this.verificationStatus =
            "UNKNOWN";

        this.supported =
            false;

        this.epistemicBoundary = {};

        this.runtimeState =
            "RuntimeRunning";

        /*
         * ---------------------------------------------------------
         * Responsibility Event
         * ---------------------------------------------------------
         */

        this.responsibilityEvent =
            null;

        this.responsibilityEventValidation =
            null;

        this.responsibilityEventPublishable =
            false;

    }


    setPipeline(pipeline = []) {

        this.pipeline =
            Array.isArray(pipeline)
                ? [...pipeline]
                : [];

        return this;

    }


    setTrace(trace = []) {

        this.runtimeTrace =
            Array.isArray(trace)
                ? [...trace]
                : [];

        return this;

    }


    setMetadata(metadata = {}) {

        const incoming =
            metadata || {};

        this.metadata = {

            ...(this.metadata || {}),

            ...incoming

        };

        /*
         * ---------------------------------------------------------
         * IMPORTANT:
         *
         * Metadata is evidence about final Runtime state.
         * These projections must never invent state.
         * ---------------------------------------------------------
         */

        if (
            typeof incoming.runtimeState ===
            "string"
        ) {

            this.runtimeState =
                incoming.runtimeState;

        }

        if (
            typeof incoming.verificationStatus ===
            "string"
        ) {

            this.verificationStatus =
                incoming.verificationStatus;

        }

        if (
            typeof incoming.supported ===
            "boolean"
        ) {

            this.supported =
                incoming.supported;

        }

        if (
            typeof incoming.epistemicState ===
            "string"
        ) {

            this.setEpistemicState(
                incoming.epistemicState
            );

        }

        if (
            typeof incoming.publishable ===
            "boolean"
        ) {

            this.responsibilityEventPublishable =
                incoming.publishable;

        }

        return this;

    }


    setEpistemicState(state) {

        const allowedStates =
            Object.values(
                RuntimeContract.epistemicStates || {}
            ).filter(
                value =>
                    typeof value === "string"
            );

        this.epistemicState =
            allowedStates.includes(state)
                ? state
                : "UNKNOWN";

        return this;

    }


    setVerificationStatus(status) {

        this.verificationStatus =
            typeof status === "string"
                ? status
                : "UNKNOWN";

        return this;

    }


    setSupported(supported) {

        this.supported =
            supported === true;

        return this;

    }


    setFinalState({

        runtimeState,
        epistemicState,
        verificationStatus,
        supported,
        publishable

    } = {}) {

        if (
            typeof runtimeState ===
            "string"
        ) {

            this.runtimeState =
                runtimeState;

        }

        if (
            typeof epistemicState ===
            "string"
        ) {

            this.setEpistemicState(
                epistemicState
            );

        }

        if (
            typeof verificationStatus ===
            "string"
        ) {

            this.verificationStatus =
                verificationStatus;

        }

        if (
            typeof supported ===
            "boolean"
        ) {

            this.supported =
                supported;

        }

        if (
            typeof publishable ===
            "boolean"
        ) {

            this.responsibilityEventPublishable =
                publishable;

        }

        return this;

    }


    buildEpistemicBoundary() {

        const contract =
            RuntimeContract || {};

        const epistemicStates =
            contract.epistemicStates || {};

        const allowedStates =
            Object.values(
                epistemicStates
            ).filter(
                state =>
                    typeof state === "string"
            );

        const currentState =
            allowedStates.includes(
                this.epistemicState
            )
                ? this.epistemicState
                : "UNKNOWN";

        const boundary = {

            state:
                currentState,

            boundaryState:
                currentState,

            allowedStates,

            source:
                "RuntimeContract.epistemicStates",

            governed:
                true,

            canPromote:
                currentState === "SUPPORTED",

            canPublish:
                currentState === "SUPPORTED",

            responsibilityBoundary:
                this.verificationBoundary || null

        };

        return boundary;

    }


    setEpistemicBoundary(boundary = {}) {

        this.epistemicBoundary = {

            ...(this.epistemicBoundary || {}),

            ...(boundary || {})

        };

        return this;

    }


    close() {

        this.runtimeState =
            "RuntimeClosed";

        return this;

    }


    isClosed() {

        return (
            this.runtimeState ===
            "RuntimeClosed"
        );

    }


    hasRequiredFields() {

        const requiredFields =
            RuntimeContract
                .runtimeResultContract
                ?.requiredFields || [];

        return requiredFields.every(
            field =>
                Object.prototype.hasOwnProperty.call(
                    this,
                    field
                )
        );

    }


    validate() {

        const requiredFields =
            RuntimeContract
                .runtimeResultContract
                ?.requiredFields || [];

        const missingFields =
            requiredFields.filter(
                field =>
                    !Object.prototype.hasOwnProperty.call(
                        this,
                        field
                    )
            );

        return {

            valid:
                missingFields.length === 0,

            missingFields

        };

    }

}


export default RuntimeResult;
