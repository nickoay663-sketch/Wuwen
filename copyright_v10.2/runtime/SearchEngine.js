import EngineBase from "./EngineBase.js";

class SearchEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "SearchEngine",
            "10.2",
            "勿问搜索运行所需的信息来源。"
        );

        this.semanticObject =
            semanticObject || {};

    }


    execute() {

        const sources =
            this.search();


        return this.result({

            status:
                "completed",

            metadata:
                this.metadata({

                    sourceCount:
                        sources.length

                }),

            sources,

            result: {

                sources

            },

            trace: [

                {

                    engine:
                        "SearchEngine",

                    action:
                        "search",

                    status:
                        "completed"

                }

            ],

            questions: [],

            nextRuntimeState:
                "EvidenceEngine"

        });

    }


    search() {

        const content =
            this.semanticObject.originalContent || "";


        if (!content) {

            return [];

        }


        return [

            {

                source:
                    "RuntimeInput",

                content

            }

        ];

    }

}


export default SearchEngine;