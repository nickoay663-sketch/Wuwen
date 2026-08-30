import EngineBase from "./EngineBase.js";

class RecognitionEngine extends EngineBase {

    constructor(expression) {

        super(
            "RecognitionEngine",
            "10.2",
            "勿问识别表达对象、概念与原始信息。"
        );

        this.expression =
            expression || "";

    }


    execute() {

        const objects =
            this.extractObjects();


        const concepts =
            this.extractConcepts();


        return this.result({

            status:
                "completed",

            metadata:
                this.metadata({

                    expressionLength:
                        this.expression.length

                }),

            objects,

            concepts,

            result: {

                objects,

                concepts

            },

            trace: [

                {

                    engine:
                        "RecognitionEngine",

                    action:
                        "recognize",

                    status:
                        "completed"

                }

            ],

            questions: [],

            nextRuntimeState:
                "DefinitionEngine"

        });

    }


    extractObjects() {

        if (!this.expression) {

            return [];

        }


        return [

            this.expression

        ];

    }


    extractConcepts() {

        if (!this.expression) {

            return [];

        }


        return [

            "Expression"

        ];

    }

}


export default RecognitionEngine;