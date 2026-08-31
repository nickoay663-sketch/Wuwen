import EngineBase from "./EngineBase.js";

class DefinitionEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "DefinitionEngine",
            "12.0",
            "Definition preserves the supplied expression system and does not assign language meaning owned by the Runtime."
        );

        this.semanticObject =
            semanticObject || {};

    }

    execute() {

        const definitions =
            this.buildDefinitions();

        const languageSystem =
            this.semanticObject.languageSystem || null;

        return this.result({

            status:
                "completed",

            languageSystem,

            languageOwnedByRuntime:
                false,

            metadata:
                this.metadata({

                    definitionCount:
                        definitions.length,

                    languageSystem,

                    languageOwnedByRuntime:
                        false

                }),

            definitions,

            result: {

                definitions,

                languageSystem,

                languageOwnedByRuntime:
                    false

            },

            trace: [

                {

                    engine:
                        "DefinitionEngine",

                    action:
                        "preserve-expression-definition",

                    status:
                        "completed"

                }

            ],

            questions: [],

            nextRuntimeState:
                "SearchEngine"

        });

    }

    buildDefinitions() {

        const content =
            this.semanticObject.originalContent || "";

        if (!content) {
            return [];
        }

        return [

            {

                expression:
                    content,

                definition:
                    "Expression entering Wuwen Runtime",

                languageSystem:
                    this.semanticObject.languageSystem || null,

                languageOwnedByRuntime:
                    false,

                fallback:
                    false

            }

        ];

    }

}

export default DefinitionEngine;
