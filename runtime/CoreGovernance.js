import CapabilityContract from "./CapabilityContract.js";
import CapabilityAdmission from "./CapabilityAdmission.js";
import WALContract from "./WALContract.js";
import WALResponsibilityInterface from "./WALResponsibilityInterface.js";

class CoreGovernance {

    constructor() {

        this.version =
            "1.3";

        this.name =
            "Wuwen Core Governance";

        this.principle =
            "能力向外增长，边界向内守住。";

        this.core = {

            status:
                "minimum-complete",

            principle:
                "Wuwen Core is a minimum-complete honest runtime infrastructure.",

            responsibilities: [

                "Honest execution",
                "Responsibility chain preservation",
                "Evidence boundary preservation",
                "Epistemic boundary preservation",
                "External language boundary preservation",
                "Runtime contract enforcement",
                "SelfCheck enforcement",
                "Execution integrity preservation",
                "Capability boundary preservation",
                "WAL responsibility boundary preservation"

            ]

        };

        this.coreBoundaries = {

            noCoreExpansion: true,
            noEvidenceFabrication: true,
            noResponsibilityExpansion: true,
            noEpistemicPromotion: true,
            noExternalLanguageOwnership: true,
            noExternalLanguageInterpretation: true,
            noPipelineBypass: true,
            noContractBypass: true,
            noSelfCheckBypass: true,
            noExecutionIntegrityBypass: true,

            noCapabilityBypass: true,
            noWALBypass: true

        };

        this.extensionPrinciples = {

            extensionsMayGrow: true,
            extensionsMustNotReplaceCore: true,
            extensionsMustNotModifyCoreRules: true,
            extensionsMustRespectContracts: true,
            extensionsMustRemainAuditable: true

        };

        this.executionIntegrity = {

            requiredMethods: [

                "validateCore",
                "validateBoundaries",
                "validateExtensions",
                "validateCapabilityBoundary",
                "validateWALBoundary",
                "validateExecutionIntegrity",
                "enforce"

            ],

            immutableMethodNames:
                true,

            executionIntegrityRequired:
                true

        };

        this.executionIntegrity.methodReferences = {};

        for (
            const methodName
            of this.executionIntegrity.requiredMethods
        ) {

            this.executionIntegrity.methodReferences[
                methodName
            ] = this[methodName];

        }

    }


    describe() {

        return {

            name:
                this.name,

            version:
                this.version,

            principle:
                this.principle,

            core:
                this.core,

            coreBoundaries:
                this.coreBoundaries,

            extensionPrinciples:
                this.extensionPrinciples,

            executionIntegrity: {

                requiredMethods:
                    this.executionIntegrity.requiredMethods,

                immutableMethodNames:
                    this.executionIntegrity.immutableMethodNames,

                executionIntegrityRequired:
                    this.executionIntegrity.executionIntegrityRequired

            }

        };

    }


    validateCore() {

        const requiredCoreResponsibilities = [

            "Honest execution",
            "Responsibility chain preservation",
            "Evidence boundary preservation",
            "Epistemic boundary preservation",
            "External language boundary preservation",
            "Runtime contract enforcement",
            "SelfCheck enforcement",
            "Execution integrity preservation",
            "Capability boundary preservation",
            "WAL responsibility boundary preservation"

        ];

        const missing =
            requiredCoreResponsibilities.filter(
                responsibility =>
                    !this.core.responsibilities.includes(
                        responsibility
                    )
            );

        return {

            passed:
                missing.length === 0,

            missing,

            status:
                missing.length === 0
                    ? "core-definition-pass"
                    : "core-definition-failed"

        };

    }


    validateBoundaries() {

        const invalid = [];

        for (
            const [name, value]
            of Object.entries(
                this.coreBoundaries
            )
        ) {

            if (value !== true) {

                invalid.push(name);

            }

        }

        return {

            passed:
                invalid.length === 0,

            invalid,

            status:
                invalid.length === 0
                    ? "core-boundary-pass"
                    : "core-boundary-failed"

        };

    }


    validateExtensions() {

        const invalid = [];

        for (
            const [name, value]
            of Object.entries(
                this.extensionPrinciples
            )
        ) {

            if (value !== true) {

                invalid.push(name);

            }

        }

        return {

            passed:
                invalid.length === 0,

            invalid,

            status:
                invalid.length === 0
                    ? "extension-boundary-pass"
                    : "extension-boundary-failed"

        };

    }


    validateCapabilityBoundary() {

        const invalid = [];

        if (
            typeof CapabilityContract.version !==
            "function"
        ) {

            invalid.push(
                "CapabilityContract.version"
            );

        }

        if (
            typeof CapabilityContract.validate !==
            "function"
        ) {

            invalid.push(
                "CapabilityContract.validate"
            );

        }

        if (
            typeof CapabilityContract.createResponse !==
            "function"
        ) {

            invalid.push(
                "CapabilityContract.createResponse"
            );

        }

        if (
            typeof CapabilityAdmission !==
            "function"
        ) {

            invalid.push(
                "CapabilityAdmission"
            );

        }

        return {

            passed:
                invalid.length === 0,

            invalid,

            status:
                invalid.length === 0
                    ? "capability-boundary-pass"
                    : "capability-boundary-failed"

        };

    }


    validateWALBoundary() {

        const invalid = [];

        if (
            typeof WALContract.validate !==
            "function"
        ) {

            invalid.push(
                "WALContract.validate"
            );

        }

        if (
            typeof WALContract.createEnvelope !==
            "function"
        ) {

            invalid.push(
                "WALContract.createEnvelope"
            );

        }

        if (
            typeof WALContract.canPropagate !==
            "function"
        ) {

            invalid.push(
                "WALContract.canPropagate"
            );

        }

        if (
            typeof WALResponsibilityInterface
                .fromResponsibilityEvent !==
            "function"
        ) {

            invalid.push(
                "WALResponsibilityInterface.fromResponsibilityEvent"
            );

        }

        if (
            typeof WALResponsibilityInterface
                .isTrustedResponsibilityRecord !==
            "function"
        ) {

            invalid.push(
                "WALResponsibilityInterface.isTrustedResponsibilityRecord"
            );

        }

        return {

            passed:
                invalid.length === 0,

            invalid,

            status:
                invalid.length === 0
                    ? "wal-boundary-pass"
                    : "wal-boundary-failed"

        };

    }


    validateExecutionIntegrity() {

        const invalid = [];

        const requiredMethods =
            this.executionIntegrity
                ?.requiredMethods || [];

        const methodReferences =
            this.executionIntegrity
                ?.methodReferences || {};

        for (
            const methodName
            of requiredMethods
        ) {

            const currentMethod =
                this[methodName];

            const originalMethod =
                methodReferences[methodName];

            if (
                typeof currentMethod !==
                "function"
            ) {

                invalid.push(
                    methodName
                );

                continue;

            }

            if (
                typeof originalMethod !==
                "function"
            ) {

                invalid.push(
                    `${methodName}:original-reference-missing`
                );

                continue;

            }

            if (
                currentMethod !==
                originalMethod
            ) {

                invalid.push(
                    `${methodName}:method-tampered`
                );

            }

        }

        if (
            this.executionIntegrity
                ?.immutableMethodNames !== true
        ) {

            invalid.push(
                "immutableMethodNames"
            );

        }

        if (
            this.executionIntegrity
                ?.executionIntegrityRequired !== true
        ) {

            invalid.push(
                "executionIntegrityRequired"
            );

        }

        return {

            passed:
                invalid.length === 0,

            invalid,

            status:
                invalid.length === 0
                    ? "execution-integrity-pass"
                    : "execution-integrity-failed"

        };

    }


    enforce() {

        const safeValidate =
            (methodName, fallback) => {

                try {

                    if (
                        typeof this[methodName] !==
                        "function"
                    ) {

                        return fallback;

                    }

                    return this[methodName]();

                } catch (error) {

                    return {

                        passed: false,

                        invalid: [
                            `${methodName}:execution-failed`
                        ],

                        error:
                            error?.message ||
                            String(error),

                        status:
                            `${methodName}-execution-failed`

                    };

                }

            };

        const core =
            safeValidate(
                "validateCore",
                {
                    passed: false,
                    missing: ["validateCore"],
                    status:
                        "core-validation-unavailable"
                }
            );

        const boundaries =
            safeValidate(
                "validateBoundaries",
                {
                    passed: false,
                    invalid: ["validateBoundaries"],
                    status:
                        "boundary-validation-unavailable"
                }
            );

        const extensions =
            safeValidate(
                "validateExtensions",
                {
                    passed: false,
                    invalid: ["validateExtensions"],
                    status:
                        "extension-validation-unavailable"
                }
            );

        const capabilityBoundary =
            safeValidate(
                "validateCapabilityBoundary",
                {
                    passed: false,
                    invalid: [
                        "validateCapabilityBoundary"
                    ],
                    status:
                        "capability-boundary-validation-unavailable"
                }
            );

        const walBoundary =
            safeValidate(
                "validateWALBoundary",
                {
                    passed: false,
                    invalid: [
                        "validateWALBoundary"
                    ],
                    status:
                        "wal-boundary-validation-unavailable"
                }
            );

        const executionIntegrity =
            safeValidate(
                "validateExecutionIntegrity",
                {
                    passed: false,
                    invalid: [
                        "validateExecutionIntegrity"
                    ],
                    status:
                        "execution-integrity-validation-unavailable"
                }
            );

        const passed =
            core.passed &&
            boundaries.passed &&
            extensions.passed &&
            capabilityBoundary.passed &&
            walBoundary.passed &&
            executionIntegrity.passed;

        return {

            governance:
                this.name,

            version:
                this.version,

            principle:
                this.principle,

            core,

            boundaries,

            extensions,

            capabilityBoundary,

            walBoundary,

            executionIntegrity,

            passed,

            status:
                passed
                    ? "governance-pass"
                    : "governance-failed"

        };

    }

}


export default CoreGovernance;
