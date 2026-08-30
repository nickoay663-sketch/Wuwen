import EngineBase from "./EngineBase.js";

class EvidenceEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "EvidenceEngine",
            "10.2",
            "勿问记录并验证表达相关证据。"
        );

        this.semanticObject =
            semanticObject || {};

    }


    execute() {

        const evidences =
            this.buildEvidence();


        return this.result({

            status:
                "completed",

            metadata:
                this.metadata({

                    evidenceCount:
                        evidences.length

                }),

            evidences,

            result: {

                evidences

            },

            trace: [

                {

                    engine:
                        "EvidenceEngine",

                    action:
                        "collect",

                    status:
                        "completed"

                }

            ],

            questions: [],

            nextRuntimeState:
                "CorrespondenceEngine"

        });

    }


    buildEvidence() {

        const content =
            this.semanticObject.originalContent || "";


        if (!content) {

            return [];

        }


        return [

            {

                type:
                    "expression",

                source:
                    content

            }

        ];

    }

}


export default EvidenceEngine;