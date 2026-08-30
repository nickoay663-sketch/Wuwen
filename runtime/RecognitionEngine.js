import EngineBase from "./EngineBase.js";
import UniversalExpression from "./UniversalExpression.js";

class RecognitionEngine extends EngineBase {

    constructor(
        expression,
        languageSystem = null
    ) {

        super(
            "RecognitionEngine",
            "22.0",
            "Recognition receives an externally supplied expression system and preserves the expression without owning a language."
        );

        this.expression =
            typeof expression === "string"
                ? expression.trim()
                : String(expression ?? "").trim();

        this.languageSystem =
            languageSystem || null;

    }

    execute() {

        const expression =
            UniversalExpression.from({

                originalExpression:
                    this.expression,

                sourceLanguage:
                    this.languageSystem

            });

        return this.result({

            status:
                "completed",

            metadata:
                this.metadata({

                    expressionLength:
                        this.expression.length,

                    languageSystem:
                        this.languageSystem,

                    languageOwnedByRuntime:
                        false,

                    objectCount:
                        0,

                    conceptCount:
                        0,

                    structureCount:
                        0

                }),

            objects: [],

            concepts: [],

            predicate: null,

            structures: [],

            nativeStructures: [],

            universalStructures: [],

            semanticSignals: [],

            universalExpression:
                expression,

            result: {

                objects: [],

                concepts: [],

                predicate: null,

                structures: [],

                nativeStructures: [],

                universalStructures: [],

                semanticSignals: [],

                universalExpression:
                    expression

            },

            trace: [

                {

                    engine:
                        "RecognitionEngine",

                    action:
                        "receive-expression",

                    status:
                        "completed"

                }

            ],

            questions: [],

            nextRuntimeState:
                "DefinitionEngine"

        });

    }

}

export default RecognitionEngine;
