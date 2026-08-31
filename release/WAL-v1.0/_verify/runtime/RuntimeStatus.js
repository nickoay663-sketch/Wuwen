import RuntimeContract from "./RuntimeContract.js";

const RuntimeStatus = {

    version:
        RuntimeContract.identity?.runtimeVersion ||
        RuntimeContract.version ||
        "10.8",

    SUCCESS:
        "SUCCESS",

    RECOGNITION_FAILED:
        "RECOGNITION_FAILED",

    DEFINITION_FAILED:
        "DEFINITION_FAILED",

    SEARCH_FAILED:
        "SEARCH_FAILED",

    EVIDENCE_MISSING:
        "EVIDENCE_MISSING",

    CORRESPONDENCE_FAILED:
        "CORRESPONDENCE_FAILED",

    REASONING_FAILED:
        "REASONING_FAILED",

    RESPONSIBILITY_FAILED:
        "RESPONSIBILITY_FAILED",

    RECONSTRUCTION_FAILED:
        "RECONSTRUCTION_FAILED",

    GENERATOR_FAILED:
        "GENERATOR_FAILED",

    SELFCHECK_FAILED:
        "SELFCHECK_FAILED",

    CONTRACT_FAILED:
        "CONTRACT_FAILED",

    REGISTRY_FAILED:
        "REGISTRY_FAILED",

    REPORT_FAILED:
        "REPORT_FAILED",

    metadata: {

        runtimeVersion:
            RuntimeContract.identity?.runtimeVersion ||
            RuntimeContract.version ||
            "10.8",

        contractVersion:
            RuntimeContract.identity?.contractVersion ||
            RuntimeContract.version ||
            "10.8",

        generatedAt:
            new Date().toISOString(),

        stageCount:
            10

    }

};

export default RuntimeStatus;
