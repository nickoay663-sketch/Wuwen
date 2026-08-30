class CapabilityContract {

    static VERSION =
        "1.1";


    static NAME =
        "CapabilityContract";


    static PROVENANCE_MARKER =
        "Wuwen.CapabilityAdapter";


    static version() {

        return this.VERSION;

    }


    static createResponse({

        capability = null,
        provider = null,
        providerVersion = null,
        status = "completed",
        output = null,
        sources = [],
        outputState = "DISCOVERED",
        verificationState = "UNVERIFIED",
        evidenceCreated = false,
        supportsClaim = false,
        verified = false,
        conclusion = null,
        trace = []

    } = {}) {

        return {

            contract:
                this.NAME,

            contractVersion:
                this.version(),

            capability,

            provider,

            providerVersion,

            status,

            output,

            sources:
                Array.isArray(sources)
                    ? sources
                    : [],

            outputState,

            verificationState,

            evidenceCreated:
                evidenceCreated === true,

            supportsClaim:
                supportsClaim === true,

            verified:
                verified === true,

            conclusion,

            provenance: {

                provider:
                    this.PROVENANCE_MARKER,

                adapter:
                    provider,

                adapterVersion:
                    providerVersion

            },

            trace:
                Array.isArray(trace)
                    ? trace
                    : []

        };

    }


    static validate(response) {

        const errors = [];

        if (
            !response ||
            typeof response !== "object" ||
            Array.isArray(response)
        ) {

            return {

                valid: false,

                errors: [
                    "Capability response must be a non-array object."
                ]

            };

        }


        if (
            typeof response.contract !== "string" ||
            response.contract !== this.NAME
        ) {

            errors.push(
                "Capability contract identity is invalid."
            );

        }


        if (
            typeof response.capability !== "string" ||
            !response.capability.trim()
        ) {

            errors.push(
                "Capability identity is required."
            );

        }


        if (
            typeof response.provider !== "string" ||
            !response.provider.trim()
        ) {

            errors.push(
                "Provider identity is required."
            );

        }


        if (
            typeof response.contractVersion !== "string" ||
            !response.contractVersion.trim()
        ) {

            errors.push(
                "Capability contract version is required."
            );

        }


        if (
            response.contractVersion !==
            this.version()
        ) {

            errors.push(
                "Capability contract version mismatch."
            );

        }


        if (
            !Array.isArray(response.sources)
        ) {

            errors.push(
                "Sources must be an array."
            );

        }


        if (
            typeof response.outputState !== "string"
        ) {

            errors.push(
                "Output state is required."
            );

        }


        if (
            typeof response.verificationState !== "string"
        ) {

            errors.push(
                "Verification state is required."
            );

        }


        if (
            response.evidenceCreated !== false
        ) {

            errors.push(
                "Capability providers cannot create Runtime evidence."
            );

        }


        if (
            response.supportsClaim !== false
        ) {

            errors.push(
                "Capability providers cannot establish claim support."
            );

        }


        if (
            response.verified !== false
        ) {

            errors.push(
                "Capability providers cannot declare verification."
            );

        }


        if (
            response.conclusion !== null &&
            response.conclusion !== undefined
        ) {

            errors.push(
                "Capability providers cannot supply Runtime conclusions."
            );

        }


        if (
            !response.provenance ||
            typeof response.provenance !== "object" ||
            Array.isArray(response.provenance)
        ) {

            errors.push(
                "Capability provenance is required."
            );

        } else {

            if (
                response.provenance.provider !==
                this.PROVENANCE_MARKER
            ) {

                errors.push(
                    "Capability provenance marker is invalid."
                );

            }

            if (
                response.provenance.adapter !==
                response.provider
            ) {

                errors.push(
                    "Capability provenance adapter does not match provider."
                );

            }

            if (
                response.provenance.adapterVersion !==
                response.providerVersion
            ) {

                errors.push(
                    "Capability provenance adapter version does not match provider version."
                );

            }

        }


        return {

            valid:
                errors.length === 0,

            errors

        };

    }


    static admit(response, trustedContext = {}) {

        const validation =
            this.validate(response);


        if (!validation.valid) {

            return {

                admitted:
                    false,

                status:
                    "capability-rejected",

                errors:
                    validation.errors,

                response:
                    null

            };

        }


        const expectedProvider =
            typeof trustedContext.provider === "string"
                ? trustedContext.provider
                : null;


        const expectedProviderVersion =
            trustedContext.providerVersion ??
            null;


        if (
            !expectedProvider
        ) {

            return {

                admitted:
                    false,

                status:
                    "capability-rejected",

                errors: [
                    "Trusted capability provider identity is required."
                ],

                response:
                    null

            };

        }


        if (
            response.provider !==
            expectedProvider
        ) {

            return {

                admitted:
                    false,

                status:
                    "capability-rejected",

                errors: [
                    "Capability provider identity does not match trusted adapter."
                ],

                response:
                    null

            };

        }


        if (
            response.providerVersion !==
            expectedProviderVersion
        ) {

            return {

                admitted:
                    false,

                status:
                    "capability-rejected",

                errors: [
                    "Capability provider version does not match trusted adapter."
                ],

                response:
                    null

            };

        }


        return {

            admitted:
                true,

            status:
                "capability-admitted",

            errors: [],

            response

        };

    }

}


export default CapabilityContract;
