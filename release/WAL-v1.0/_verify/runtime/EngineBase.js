import RuntimeContract from "./RuntimeContract.js";

class EngineBase {

    constructor(
        engine,
        version,
        principle
    ) {

        this.engine =
            engine;

        this.version =
            version;

        this.principle =
            principle;

        this.status =
            "ready";

        this.capabilities =
            [];

        this.nextRuntimeState =
            null;

        this.contract =
            RuntimeContract;

    }


    metadata(extra = {}) {

        return {

            generatedAt:
                new Date().toISOString(),

            runtimeVersion:
                RuntimeContract.identity.runtimeVersion,

            contractVersion:
                RuntimeContract.identity.contractVersion,

            engine:
                this.engine,

            version:
                this.version,

            status:
                this.status,

            principle:
                this.principle,

            capabilities:
                this.capabilities,

            nextRuntimeState:
                this.nextRuntimeState,

            ...extra

        };

    }


    result(data = {}) {

        const result = {

            engine:
                this.engine,

            version:
                this.version,

            principle:
                this.principle,

            status:
                this.status,

            trace:
                [],

            questions:
                [],

            nextRuntimeState:
                this.nextRuntimeState,

            result:
                data,

            metadata:
                this.metadata(),

            ...data

        };

        return this.enforceContract(
            result
        );

    }


    enforceContract(result = {}) {

        const contract =
            this.contract?.engineContract || {};

        const requiredFields =
            Array.isArray(
                contract.requiredFields
            )
                ? contract.requiredFields
                : [];

        const missingFields =
            requiredFields.filter(
                field =>
                    !Object.prototype.hasOwnProperty.call(
                        result,
                        field
                    )
            );

        if (missingFields.length > 0) {

            throw new Error(
                `${this.engine} violates RuntimeContract: missing required fields: ${missingFields.join(", ")}`
            );

        }

        const fieldTypes =
            contract.fieldTypes || {};

        for (
            const [field, expectedType]
            of Object.entries(fieldTypes)
        ) {

            if (
                !Object.prototype.hasOwnProperty.call(
                    result,
                    field
                )
            ) {

                continue;

            }

            const value =
                result[field];

            let valid =
                true;

            if (expectedType === "array") {

                valid =
                    Array.isArray(value);

            } else if (
                expectedType === "object"
            ) {

                valid =
                    value !== null &&
                    typeof value === "object" &&
                    !Array.isArray(value);

            } else {

                valid =
                    typeof value ===
                    expectedType;

            }

            if (!valid) {

                throw new Error(
                    `${this.engine} violates RuntimeContract: field "${field}" must be ${expectedType}`
                );

            }

        }

        return result;

    }


    canCreateEvidence() {

        return (
            this.contract
                ?.searchContract
                ?.rules
                ?.searchCannotCreateEvidence === false
        );

    }


    canCreateConclusion() {

        const rules =
            this.contract
                ?.reasoningContract
                ?.rules || {};

        return (
            rules.reasoningCannotExceedEvidence !==
            true
        );

    }


    canPromoteToSupported(
        verificationStatus,
        verifiedEvidenceCount = 0,
        correspondenceSupported = false
    ) {

        if (
            verificationStatus !==
            "VERIFIED"
        ) {

            return false;

        }

        if (
            verifiedEvidenceCount <= 0
        ) {

            return false;

        }

        if (
            correspondenceSupported !== true
        ) {

            return false;

        }

        return true;

    }


    enforceEpistemicBoundary(
        state
    ) {

        const allowedStates =
            Object.values(
                this.contract
                    ?.epistemicStates || {}
            );

        if (
            !allowedStates.includes(state)
        ) {

            return "UNKNOWN";

        }

        return state;

    }


    enforceSupportBoundary(
        supported,
        verificationStatus,
        verifiedEvidenceCount = 0,
        correspondenceSupported = false
    ) {

        const valid =
            supported === true &&
            verificationStatus ===
            "SUPPORTED" &&
            verifiedEvidenceCount > 0 &&
            correspondenceSupported === true;

        return valid;

    }


    setStatus(status) {

        if (
            typeof status === "string" &&
            status.length > 0
        ) {

            this.status =
                status;

        }

        return this;

    }


    setCapabilities(capabilities = []) {

        this.capabilities =
            Array.isArray(capabilities)
                ? capabilities
                : [];

        return this;

    }


    setNextRuntimeState(nextRuntimeState) {

        this.nextRuntimeState =
            nextRuntimeState;

        return this;

    }


    execute() {

        throw new Error(
            `${this.engine} must implement execute()`
        );

    }

}

export default EngineBase;
