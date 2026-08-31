import EngineBase from "./EngineBase.js";

class CorrespondenceEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "CorrespondenceEngine",
            "10.2",
            "勿问判断定义、证据与表达之间的真实对应关系。"
        );

        this.semanticObject =
            semanticObject || {};

    }


    execute() {

        const correspondences =
            this.buildCorrespondences();


        return this.result({

            status:
                "completed",

            metadata:
                this.metadata({

                    correspondenceCount:
                        correspondences.length

                }),

            correspondences,

            result: {

                correspondences

            },

            trace: [

                {

                    engine:
                        "CorrespondenceEngine",

                    action:
                        "check",

                    status:
                        "completed"

                }

            ],

            questions: [],

            nextRuntimeState:
                "ReasoningEngine"

        });

    }


    buildCorrespondences() {

        const definitions =
            this.semanticObject.definitions || [];


        const evidences =
            this.semanticObject.evidences || [];


        if (
            definitions.length === 0 &&
            evidences.length === 0
        ) {

            return [];

        }


        return [

            {

                definitionCount:
                    definitions.length,

                evidenceCount:
                    evidences.length,

                matched:
                    definitions.length > 0 &&
                    evidences.length > 0

            }

        ];

    }

}


export default CorrespondenceEngine;
