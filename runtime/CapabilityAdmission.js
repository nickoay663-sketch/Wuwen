import CapabilityContract from "./CapabilityContract.js";

class CapabilityAdmission {

    constructor(options = {}) {

        this.name =
            options.name ||
            "CapabilityAdmission";

        this.version =
            "1.1";

        this.trustedProvider =
            options.trustedProvider ||
            null;

        this.trustedProviderVersion =
            options.trustedProviderVersion ??
            null;

    }


    admit(response) {

        const admission =
            CapabilityContract.admit(
                response,
                {
                    provider:
                        this.trustedProvider,

                    providerVersion:
                        this.trustedProviderVersion
                }
            );


        if (
            admission.admitted !== true
        ) {

            return {

                admitted:
                    false,

                status:
                    "capability-rejected",

                admission:
                    "REJECT",

                errors:
                    admission.errors || [],

                response:
                    null,

                trace: [

                    {

                        engine:
                            "CapabilityAdmission",

                        action:
                            "trusted-capability-admission",

                        status:
                            "rejected"

                    }

                ]

            };

        }


        return {

            admitted:
                true,

            status:
                "capability-admitted",

            admission:
                "PASS",

            errors:
                [],

            response:
                admission.response,

            trace: [

                {

                    engine:
                        "CapabilityAdmission",

                    action:
                        "trusted-capability-admission",

                    status:
                        "passed"

                }

            ]

        };


    }


    isAdmitted(response) {

        const result =
            this.admit(
                response
            );


        return (
            result.admitted === true
        );

    }


    contract() {

        return {

            name:
                this.name,

            version:
                this.version,

            trustedProvider:
                this.trustedProvider,

            trustedProviderVersion:
                this.trustedProviderVersion,

            principles: [

                "TRUSTED_PROVIDER_REQUIRED",

                "PROVIDER_VERSION_MUST_MATCH",

                "CAPABILITY_CONTRACT_MUST_VALIDATE",

                "REJECT_UNTRUSTED_CAPABILITY",

                "NO_RUNTIME_EVIDENCE_CREATION",

                "NO_RUNTIME_VERIFICATION",

                "NO_RUNTIME_CONCLUSION"

            ]

        };

    }

}


export default CapabilityAdmission;
