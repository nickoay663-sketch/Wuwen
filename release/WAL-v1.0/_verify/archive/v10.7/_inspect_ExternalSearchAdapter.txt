import CapabilityContract from "./CapabilityContract.js";
import CapabilityAdmission from "./CapabilityAdmission.js";

class ExternalSearchAdapter {

    constructor(options = {}) {

        this.name =
            options.name ||
            "ExternalSearchAdapter";

        this.version =
            "1.3";

        this.enabled =
            options.enabled === true;

        this.provider =
            typeof options.provider === "function"
                ? options.provider
                : null;

        this.capability =
            "external-search";

    }


    async search(query) {

        const normalizedQuery =
            typeof query === "string"
                ? query.trim()
                : "";


        if (!normalizedQuery) {

            return this.buildCapabilityResponse({

                status:
                    "search-empty",

                output: null,

                sources: []

            });

        }


        if (!this.enabled) {

            return this.buildCapabilityResponse({

                status:
                    "adapter-disabled",

                output: {

                    query:
                        normalizedQuery

                },

                sources: [],

                admissionExpected:
                    "REJECT"

            });

        }


        if (!this.provider) {

            return this.buildCapabilityResponse({

                status:
                    "provider-unavailable",

                output: {

                    query:
                        normalizedQuery

                },

                sources: [],

                admissionExpected:
                    "REJECT"

            });

        }


        let providerResult;


        try {

            providerResult =
                await this.provider(
                    normalizedQuery
                );

        } catch (error) {

            return this.buildCapabilityResponse({

                status:
                    "provider-error",

                output: {

                    query:
                        normalizedQuery

                },

                sources: [],

                error:
                    error &&
                        error.message
                        ? error.message
                        : String(error),

                admissionExpected:
                    "REJECT"

            });

        }


        const suppliedSources =
            providerResult &&
                Array.isArray(
                    providerResult.sources
                )
                ? providerResult.sources
                : [];


        const sources =
            suppliedSources
                .filter(
                    source =>
                        this.isUsableSource(
                            source
                        )
                )
                .map(
                    source =>
                        this.normalizeSource(
                            source
                        )
                );


        return this.buildCapabilityResponse({

            status:
                sources.length > 0
                    ? "search-completed"
                    : "search-empty",

            output: {

                query:
                    normalizedQuery,

                providerStatus:
                    providerResult?.status ||
                    null

            },

            sources,

            admissionExpected:
                "PASS"

        });

    }


    buildCapabilityResponse({

        status =
        "completed",

        output =
        null,

        sources =
        [],

        error =
        null,

        admissionExpected =
        "PASS"

    } = {}) {

        const response =
            CapabilityContract.createResponse({

                capability:
                    this.capability,

                provider:
                    this.name,

                providerVersion:
                    this.version,

                status,

                output,

                sources,

                outputState:
                    sources.length > 0
                        ? "DISCOVERED"
                        : "UNKNOWN",

                verificationState:
                    "UNVERIFIED",

                evidenceCreated:
                    false,

                supportsClaim:
                    false,

                verified:
                    false,

                conclusion:
                    null,

                trace: [

                    {

                        engine:
                            "ExternalSearchAdapter",

                        action:
                            "capability-contract",

                        status:
                            "created"

                    }

                ]

            });


        const admission =
            new CapabilityAdmission({

                trustedProvider:
                    this.name,

                trustedProviderVersion:
                    this.version

            });


        const admissionResult =
            admission.admit(
                response
            );


        if (
            admissionResult.admitted !== true
        ) {

            return {

                status:
                    "capability-rejected",

                query:
                    output?.query ||
                    "",

                sources: [],

                capability:
                    null,

                capabilityAdmission:
                    "REJECT",

                admission:
                    admissionResult,

                error

            };

        }


        if (
            admissionExpected === "REJECT"
        ) {

            return {

                status,

                query:
                    output?.query ||
                    "",

                sources: [],

                capability:
                    response,

                capabilityAdmission:
                    "REJECT",

                admission: {

                    ...admissionResult,

                    admitted:
                        false,

                    status:
                        "capability-rejected",

                    admission:
                        "REJECT",

                    errors: [

                        `Capability unavailable: ${status}.`

                    ],

                    trace: [

                        ...admissionResult.trace,

                        {

                            engine:
                                "ExternalSearchAdapter",

                            action:
                                "capability-availability",

                            status:
                                "rejected"

                        }

                    ]

                },

                error

            };

        }


        return {

            status,

            query:
                output?.query ||
                "",

            sources:
                response.sources,

            capability:
                response,

            capabilityAdmission:
                "PASS",

            admission:
                admissionResult,

            error

        };

    }


    isUsableSource(source) {

        if (
            !source ||
            typeof source !== "object"
        ) {

            return false;

        }


        const hasIdentity =
            Boolean(
                typeof source.source === "string" &&
                source.source.trim()
            ) ||
            Boolean(
                typeof source.url === "string" &&
                source.url.trim()
            );


        const hasContent =
            typeof source.content === "string" &&
            source.content.trim().length > 0;


        return (
            hasIdentity &&
            hasContent
        );

    }


    normalizeSource(source) {

        /*
         * ---------------------------------------------------------
         * External Claim Preservation Boundary
         *
         * 外部可以声称：
         *
         *   verified = true
         *   verificationStatus = VERIFIED
         *   verificationBasis = ...
         *   verificationSource = ...
         *   verifier = ...
         *
         * Adapter 必须保留“外部曾经这样声称”的事实。
         *
         * 但是：
         *
         *   externalVerificationClaim
         *          ≠
         *   RuntimeVerificationRecord
         *
         * 因此下面的 Runtime 验证字段仍然强制关闭。
         * ---------------------------------------------------------
         */

        const externalVerificationClaim =
            source.externalVerificationClaim === true ||
            source.verified === true ||
            source.verificationStatus === "VERIFIED";


        const externalVerificationBasis =
            source.externalVerificationBasis ||
            source.verificationBasis ||
            source.verificationSource ||
            source.verifier ||
            null;


        return {

            source:
                source.source ||
                source.url,

            url:
                source.url || null,

            title:
                source.title || null,

            publisher:
                source.publisher || null,

            publishedTime:
                source.publishedTime || null,

            content:
                source.content,

            type:
                source.type ||
                "external",

            state:
                "DISCOVERED",

            epistemicState:
                "DISCOVERED",

            verificationStatus:
                "UNVERIFIED",

            verified:
                false,

            verificationBasis:
                null,

            verificationSource:
                null,

            verifier:
                null,

            /*
             * -----------------------------------------------------
             * External Claim Record
             *
             * 这是外部输入事实，不是 Runtime 验证。
             * -----------------------------------------------------
             */

            externalVerificationClaim,

            externalVerificationBasis,

            runtimeVerificationRecord:
                false,

            supportsClaim:
                false,

            independent:
                source.independent === true

        };

    }

}


export default ExternalSearchAdapter;
