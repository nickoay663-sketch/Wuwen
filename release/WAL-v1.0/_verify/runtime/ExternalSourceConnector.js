import ExternalSearchAdapter from "./ExternalSearchAdapter.js";
import CapabilityContract from "./CapabilityContract.js";
import CapabilityAdmission from "./CapabilityAdmission.js";

class ExternalSourceConnector {

    constructor(searchRequest = {}) {

        this.searchRequest =
            searchRequest || {};

        const suppliedAdapter =
            this.searchRequest.adapter;


        if (
            suppliedAdapter &&
            typeof suppliedAdapter.search === "function"
        ) {

            this.adapter =
                suppliedAdapter;

        } else {

            this.adapter =
                new ExternalSearchAdapter(

                    suppliedAdapter &&
                        typeof suppliedAdapter === "object"
                        ? suppliedAdapter
                        : (
                            this.searchRequest.adapterOptions ||
                            {}
                        )

                );

        }


        this.capabilityAdmission =
            new CapabilityAdmission({

                trustedProvider:
                    this.adapter.name ||
                    "ExternalSearchAdapter",

                trustedProviderVersion:
                    this.adapter.version ||
                    null

            });

    }


    async run() {

        const searchResult =
            await this.adapter.search(
                this.searchRequest.keyword || ""
            );


        const suppliedSources =
            searchResult &&
                Array.isArray(searchResult.sources)
                ? searchResult.sources
                : [];


        const sources =
            suppliedSources
                .filter(
                    source =>
                        this.isRealSource(source)
                )
                .map(
                    source =>
                        this.normalizeSource(source)
                );


        if (
            searchResult?.capabilityAdmission ===
            "REJECT"
        ) {

            return {

                engine:
                    "ExternalSourceConnector",

                version:
                    "10.8",

                principle:
                    "Connector 尊重 Adapter 已完成的 Capability Admission，不得将 REJECT 重新提升为 PASS。",

                status:
                    "capability-rejected",

                adapter: {

                    name:
                        this.adapter.name ||
                        "ExternalSearchAdapter",

                    version:
                        this.adapter.version ||
                        null,

                    status:
                        searchResult?.status ||
                        "unknown"

                },

                capability: {

                    contract:
                        searchResult?.capability?.contract ||
                        "CapabilityContract",

                    contractVersion:
                        searchResult?.capability?.contractVersion ||
                        CapabilityContract.version(),

                    capability:
                        searchResult?.capability?.capability ||
                        null,

                    provider:
                        searchResult?.capability?.provider ||
                        this.adapter.name ||
                        null,

                    providerVersion:
                        searchResult?.capability?.providerVersion ||
                        this.adapter.version ||
                        null,

                    admission:
                        "REJECT",

                    errors:
                        searchResult?.admission?.errors ||
                        [
                            `Adapter rejected capability: ${searchResult?.status || "unknown"}`
                        ]

                },

                sources: [],

                result: {

                    sources: [],

                    sourceCount:
                        0,

                    outputState:
                        "REJECTED",

                    verificationState:
                        "UNVERIFIED",

                    evidenceCreated:
                        false

                },

                trace: [

                    ...(Array.isArray(
                        searchResult?.capability?.trace
                    )
                        ? searchResult.capability.trace
                        : []),

                    ...(Array.isArray(
                        searchResult?.admission?.trace
                    )
                        ? searchResult.admission.trace
                        : []),

                    {

                        engine:
                            "ExternalSourceConnector",

                        action:
                            "adapter-admission",

                        status:
                            "rejected"

                    }

                ],

                questions:
                    searchResult?.admission?.errors ||
                    [
                        "外部 Capability 未通过 Adapter Admission。"
                    ],

                nextRuntimeState:
                    "EvidenceEngine"

            };

        }


        const adapterCapability =
            searchResult &&
                searchResult.capability &&
                typeof searchResult.capability === "object"
                ? searchResult.capability
                : null;


        if (!adapterCapability) {

            return {

                engine:
                    "ExternalSourceConnector",

                version:
                    "10.8",

                principle:
                    "外部能力必须由 Adapter 产生合法 CapabilityContract，并经过 Capability Admission 与 Provenance 校验。Connector 不伪造 Capability。",

                status:
                    "capability-rejected",

                adapter: {

                    name:
                        this.adapter.name ||
                        "ExternalSearchAdapter",

                    version:
                        this.adapter.version ||
                        null,

                    status:
                        searchResult?.status ||
                        "unknown"

                },

                capability: {

                    contract:
                        "CapabilityContract",

                    contractVersion:
                        CapabilityContract.version(),

                    capability:
                        null,

                    provider:
                        this.adapter.name ||
                        "ExternalSearchAdapter",

                    providerVersion:
                        this.adapter.version ||
                        null,

                    admission:
                        "REJECT",

                    errors: [
                        "External adapter did not return a CapabilityContract."
                    ]

                },

                sources: [],

                result: {

                    sources: [],

                    sourceCount:
                        0,

                    outputState:
                        "REJECTED",

                    verificationState:
                        "UNVERIFIED",

                    evidenceCreated:
                        false

                },

                trace: [

                    {

                        engine:
                            "ExternalSourceConnector",

                        action:
                            "capability-contract-required",

                        status:
                            "rejected"

                    }

                ],

                questions: [
                    "External adapter did not return a valid CapabilityContract."
                ],

                nextRuntimeState:
                    "EvidenceEngine"

            };

        }


        const admission =
            this.capabilityAdmission.admit(
                adapterCapability
            );


        if (
            admission.admitted !== true
        ) {

            return {

                engine:
                    "ExternalSourceConnector",

                version:
                    "10.8",

                principle:
                    "外部能力必须通过 Capability Admission 与 Adapter Provenance 双重边界才能进入 Runtime。Capability 不产生证据、验证或结论。",

                status:
                    "capability-rejected",

                adapter: {

                    name:
                        this.adapter.name ||
                        "ExternalSearchAdapter",

                    version:
                        this.adapter.version ||
                        null,

                    status:
                        searchResult?.status ||
                        "unknown"

                },

                capability: {

                    contract:
                        adapterCapability.contract ||
                        "CapabilityContract",

                    contractVersion:
                        adapterCapability.contractVersion ||
                        CapabilityContract.version(),

                    capability:
                        adapterCapability.capability ||
                        null,

                    provider:
                        adapterCapability.provider ||
                        null,

                    providerVersion:
                        adapterCapability.providerVersion ||
                        null,

                    admission:
                        "REJECT",

                    errors:
                        admission.errors

                },

                sources: [],

                result: {

                    sources: [],

                    sourceCount:
                        0,

                    outputState:
                        "REJECTED",

                    verificationState:
                        "UNVERIFIED",

                    evidenceCreated:
                        false

                },

                trace: [

                    ...(Array.isArray(
                        adapterCapability.trace
                    )
                        ? adapterCapability.trace
                        : []),

                    ...admission.trace,

                    {

                        engine:
                            "ExternalSourceConnector",

                        action:
                            "provenance-validation",

                        status:
                            "rejected"

                    }

                ],

                questions:
                    admission.errors,

                nextRuntimeState:
                    "EvidenceEngine"

            };

        }


        return {

            engine:
                "ExternalSourceConnector",

            version:
                "10.8",

            principle:
                "勿问连接外部来源，但不把来源内容直接视为证据。Capability PASS 不等于来源存在，更不等于事实已验证。",

            status:
                sources.length > 0
                    ? "source-connected"
                    : "need-source",

            adapter: {

                name:
                    this.adapter.name ||
                    "ExternalSearchAdapter",

                version:
                    this.adapter.version ||
                    null,

                status:
                    searchResult?.status ||
                    "unknown"

            },

            capability: {

                contract:
                    adapterCapability.contract,

                contractVersion:
                    adapterCapability.contractVersion,

                capability:
                    adapterCapability.capability,

                provider:
                    adapterCapability.provider,

                providerVersion:
                    adapterCapability.providerVersion,

                admission:
                    "PASS",

                status:
                    "capability-admitted"

            },

            capabilityAdmission:
                "PASS",

            sources,

            result: {

                sources,

                sourceCount:
                    sources.length,

                outputState:
                    adapterCapability.outputState ||
                    (
                        sources.length > 0
                            ? "DISCOVERED"
                            : "UNKNOWN"
                    ),

                verificationState:
                    adapterCapability.verificationState ||
                    "UNVERIFIED",

                evidenceCreated:
                    adapterCapability.evidenceCreated === true

            },

            trace: [

                ...(Array.isArray(
                    adapterCapability.trace
                )
                    ? adapterCapability.trace
                    : []),

                ...admission.trace,

                {

                    engine:
                        "ExternalSourceConnector",

                    action:
                        "capability-admitted",

                    status:
                        "passed"

                }

            ],

            questions:
                sources.length > 0
                    ? []
                    : [
                        "没有连接到真实外部来源。"
                    ],

            nextRuntimeState:
                "EvidenceEngine"

        };

    }


    isRealSource(source) {

        if (
            !source ||
            typeof source !== "object"
        ) {

            return false;

        }


        const hasSourceIdentity =
            Boolean(
                source.source ||
                source.url
            );


        const hasContent =
            typeof source.content === "string" &&
            source.content.trim().length > 0;


        return (
            hasSourceIdentity &&
            hasContent
        );

    }


    normalizeSource(source) {

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

            verificationStatus:
                "UNVERIFIED",

            epistemicState:
                "DISCOVERED",

            verified:
                false,

            verificationBasis:
                null,

            verificationSource:
                null,

            verifier:
                null,

            /*
             * 外部声明保留为输入事实，
             * 但永远不成为 Runtime 验证记录。
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


export default ExternalSourceConnector;
