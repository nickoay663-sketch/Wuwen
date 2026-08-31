import EngineBase from "./EngineBase.js";
import ExternalSourceConnector from "./ExternalSourceConnector.js";

class SearchEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "SearchEngine",
            "15.1",
            "勿问搜索运行所需的信息来源。搜索可以扩大所见，但不能扩大所证。外部能力必须经过 Capability Admission。运行时提供的搜索结果必须进入统一发现链，但不得因此自动获得验证资格。"
        );

        this.semanticObject =
            semanticObject || {};

    }


    async execute() {

        const searchResult =
            await this.search();


        const sources =
            Array.isArray(searchResult.sources)
                ? searchResult.sources
                : [];


        return this.result({

            status:
                "completed",

            metadata:
                this.metadata({

                    sourceCount:
                        sources.length,

                    outputState:
                        searchResult.outputState ||
                        "DISCOVERED",

                    verificationState:
                        searchResult.verificationState ||
                        "UNVERIFIED",

                    evidenceCreated:
                        searchResult.evidenceCreated === true,

                    capability:
                        searchResult.capability || null

                }),

            sources,

            capability:
                searchResult.capability || null,

            capabilityAdmission:
                searchResult.capabilityAdmission || null,

            result: {

                sources,

                sourceCount:
                    sources.length,

                outputState:
                    searchResult.outputState ||
                    "DISCOVERED",

                verificationState:
                    searchResult.verificationState ||
                    "UNVERIFIED",

                evidenceCreated:
                    searchResult.evidenceCreated === true

            },

            trace: [

                {

                    engine:
                        "SearchEngine",

                    action:
                        "search-runtime-input",

                    status:
                        "completed"

                },

                ...(Array.isArray(searchResult.trace)
                    ? searchResult.trace
                    : [])

            ],

            questions:
                Array.isArray(searchResult.questions)
                    ? searchResult.questions
                    : [],

            nextRuntimeState:
                "EvidenceEngine"

        });

    }


    async search() {

        const content =
            this.semanticObject.originalContent || "";


        /*
         * ---------------------------------------------------------
         * Runtime Input
         * ---------------------------------------------------------
         */

        const runtimeSources =
            content
                ? [

                    {

                        source:
                            "RuntimeInput",

                        content,

                        type:
                            "runtime-input",

                        origin:
                            "runtime",

                        state:
                            "DISCOVERED",

                        verificationStatus:
                            "UNVERIFIED",

                        epistemicState:
                            "DISCOVERED",

                        verified:
                            false,

                        supportsClaim:
                            false,

                        independent:
                            false

                    }

                ]
                : [];


        /*
         * ---------------------------------------------------------
         * Supplied Search Results
         *
         * HonestRuntime 可以接收外部已经发现的信息。
         *
         * 这里的职责只有：
         *
         *   1. 接收
         *   2. 统一进入 SearchResult
         *   3. 保留原始声明
         *
         * SearchEngine 不把：
         *
         *   verified
         *   verificationStatus
         *   verificationBasis
         *
         * 转换成 Runtime 验证。
         *
         * 因此：
         *
         *   外部声称 VERIFIED
         *          ↓
         *   SearchEngine
         *          ↓
         *   DISCOVERED
         *          ↓
         *   EvidenceEngine
         *          ↓
         *   UNVERIFIED
         *
         * 真正的 VERIFIED 必须由 Runtime 验证记录产生。
         * ---------------------------------------------------------
         */

        const suppliedSearchResults =
            Array.isArray(
                this.semanticObject.searchResults
            )
                ? this.semanticObject.searchResults
                    .filter(
                        item =>
                            item &&
                            typeof item === "object"
                    )
                    .map(
                        item => ({

                            ...item,

                            origin:
                                item.origin ||
                                "supplied-search-result",

                            state:
                                "DISCOVERED",

                            epistemicState:
                                "DISCOVERED",

                            verificationStatus:
                                "UNVERIFIED",

                            verified:
                                false

                        })
                    )
                : [];


        /*
         * ---------------------------------------------------------
         * External Capability
         *
         * SearchEngine 只接收 Capability 的发现结果。
         *
         * Capability 不制造证据。
         * Capability 不执行验证。
         * Capability 不生成结论。
         * ---------------------------------------------------------
         */

        const externalConnector =
            this.semanticObject.externalSourceConnector ||
            new ExternalSourceConnector({

                keyword:
                    content,

                adapter:
                    this.semanticObject.externalSearchAdapter,

                adapterOptions:
                    this.semanticObject.externalSearchAdapterOptions ||
                    {}

            });


        const externalResult =
            await externalConnector.run();


        const externalSources =
            externalResult &&
                Array.isArray(externalResult.sources)
                ? externalResult.sources
                : [];


        /*
         * ---------------------------------------------------------
         * Unified Discovery Sources
         *
         * 顺序：
         *
         * RuntimeInput
         * Supplied Search Results
         * External Capability Results
         *
         * 全部只能进入 DISCOVERED 层。
         * ---------------------------------------------------------
         */

        const sources = [

            ...runtimeSources,

            ...suppliedSearchResults,

            ...externalSources

        ];


        return {

            status:
                externalResult &&
                    externalResult.status
                    ? externalResult.status
                    : "completed",

            sources,

            sourceCount:
                sources.length,

            outputState:
                "DISCOVERED",

            verificationState:
                "UNVERIFIED",

            evidenceCreated:
                externalResult &&
                externalResult.result &&
                externalResult.result.evidenceCreated === true,

            capability:
                externalResult &&
                    externalResult.capability
                    ? externalResult.capability
                    : null,

            capabilityAdmission:
                externalResult &&
                    externalResult.capability
                    ? externalResult.capability.admission || null
                    : null,

            trace:
                externalResult &&
                    Array.isArray(externalResult.trace)
                    ? externalResult.trace
                    : [],

            questions:
                externalResult &&
                    Array.isArray(externalResult.questions)
                    ? externalResult.questions
                    : []

        };

    }

}


export default SearchEngine;
