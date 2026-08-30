import LanguageDetector from "./LanguageDetector.js";
import RecognitionEngine from "./RecognitionEngine.js";
import DefinitionEngine from "./DefinitionEngine.js";
import SearchEngine from "./SearchEngine.js";
import EvidenceEngine from "./EvidenceEngine.js";
import CorrespondenceEngine from "./CorrespondenceEngine.js";
import ReasoningEngine from "./ReasoningEngine.js";
import ResponsibilityEngine from "./ResponsibilityEngine.js";
import ReconstructionEngine from "./ReconstructionEngine.js";
import GeneratorEngine from "./GeneratorEngine.js";
import SelfCheckEngine from "./SelfCheckEngine.js";
import WuwenIdentity from "./WuwenIdentity.js";
import RuntimeContract from "./RuntimeContract.js";
import EngineRegistry from "./EngineRegistry.js";
import RuntimeResult from "./RuntimeResult.js";
import TestimonyBuilder from "./TestimonyBuilder.js";
import TestimonyValidator from "./TestimonyValidator.js";

class HonestRuntime {

    constructor(expression) {

        this.expression =
            expression || "";

    }


    run() {

        const trace = [];

        const runtimeResult =
            new RuntimeResult();

       const runtimeVersion =

    "10.2";


        const testimony =
            new TestimonyBuilder(
                this.expression
            ).run();


        const testimonyValidation =
            new TestimonyValidator(
                testimony
            ).run();



        const pipeline = [

            "Recognition",

            "Definition",

            "Search",

            "Evidence",

            "Correspondence",

            "Reasoning",

            "Responsibility",

            "Reconstruction",

            "Generator",

            "SelfCheck"

        ];



        const identity =
            new WuwenIdentity().run();



        const language =
            new LanguageDetector(
                this.expression
            ).run();



        const recognition =
            new RecognitionEngine(
                this.expression
            ).execute();



        trace.push({

            engine:
                "RecognitionEngine",

            status:
                recognition.status,

            version:
                recognition.version

        });



        const semanticObject = {

            originalContent:
                this.expression,

            language:
                language.language,

            objects:
                recognition.objects || [],

            concepts:
                recognition.concepts || [],

            testimony,

            testimonyValidation

        };


        const definition =
            new DefinitionEngine(
                semanticObject
            ).execute();



        trace.push({

            engine:
                "DefinitionEngine",

            status:
                definition.status,

            version:
                definition.version

        });


        const search =
            new SearchEngine(
                semanticObject
            ).execute();


        const evidence =
            new EvidenceEngine({

                ...semanticObject,

                search

            }).execute();


        const correspondence =
            new CorrespondenceEngine({

                ...semanticObject,

                definitions:
                    definition.definitions || [],

                evidences:
                    evidence.evidences || []

            }).execute();



        const reasoning =
            new ReasoningEngine({

                ...semanticObject,

                correspondences:
                    correspondence.correspondences || []

            }).execute();



        const responsibility =
            new ResponsibilityEngine({

                ...semanticObject,

                reasonings:
                    reasoning.reasonings || []

            }).execute();



        const reconstruction =
            new ReconstructionEngine({

                semanticObject,

                responsibility

            }).execute();



        const generator =
            new GeneratorEngine({

                semanticObject,

                reconstruction,

                responsibility

            }).execute();



        const engineRegistry =
            new EngineRegistry();


        engineRegistry.register(
            "recognition",
            recognition
        );

        engineRegistry.register(
            "definition",
            definition
        );

        engineRegistry.register(
            "search",
            search
        );

        engineRegistry.register(
            "evidence",
            evidence
        );

        engineRegistry.register(
            "correspondence",
            correspondence
        );

        engineRegistry.register(
            "reasoning",
            reasoning
        );

        engineRegistry.register(
            "responsibility",
            responsibility
        );

        engineRegistry.register(
            "reconstruction",
            reconstruction
        );

        engineRegistry.register(
            "generator",
            generator
        );



        const engines =
            engineRegistry.all();


        trace.push({

            engine:
                "SearchEngine",

            status:
                search.status,

            version:
                search.version

        });


        trace.push({

            engine:
                "EvidenceEngine",

            status:
                evidence.status,

            version:
                evidence.version

        });


        trace.push({

            engine:
                "CorrespondenceEngine",

            status:
                correspondence.status,

            version:
                correspondence.version

        });


        trace.push({

            engine:
                "ReasoningEngine",

            status:
                reasoning.status,

            version:
                reasoning.version

        });


        trace.push({

            engine:
                "ResponsibilityEngine",

            status:
                responsibility.status,

            version:
                responsibility.version

        });


        trace.push({

            engine:
                "ReconstructionEngine",

            status:
                reconstruction.status,

            version:
                reconstruction.version

        });


        trace.push({

            engine:
                "GeneratorEngine",

            status:
                generator.status,

            version:
                generator.version

        });

        const selfCheck =
            new SelfCheckEngine({

                pipeline,

                contract:
                    RuntimeContract,

                engines,

                engineRegistry,

                semanticObject,

                runtimeTrace:
                    trace

            }).execute();



        trace.push({

            engine:
                "SelfCheckEngine",

            status:
                selfCheck.status,

            version:
                selfCheck.version

        });



        runtimeResult.runtimeVersion =
            runtimeVersion;



        runtimeResult.setMetadata({

            contractVersion:
                RuntimeContract.version,

            runtimeVersion:
                runtimeVersion,

            engineCount:
                engineRegistry.list().length

        });



        runtimeResult.recognition =
            recognition;


        runtimeResult.definition =
            definition;


        runtimeResult.testimony =
            testimony;


        runtimeResult.testimonyValidation =
            testimonyValidation;


        runtimeResult.search =
            search;


        runtimeResult.evidence =
            evidence;


        runtimeResult.correspondence =
            correspondence;


        runtimeResult.reasoning =
            reasoning;


        runtimeResult.responsibility =
            responsibility;


        runtimeResult.responsibilityModel =
            responsibility.responsibilities || [];



        runtimeResult.reconstruction =
            reconstruction;


        runtimeResult.generator =
            generator;


        runtimeResult.selfCheck =
            selfCheck;


        runtimeResult.engineRegistry =
            engineRegistry;



        runtimeResult.testimonyChain = {

            testimony,

            testimonyValidation,

            responsibility

        };



        runtimeResult.verificationBoundary = {

            evidenceBoundary:
                reconstruction.reconstruction?.evidenceBoundary,

            sourceBoundary:
                reconstruction.reconstruction?.sourceBoundary,

            responsibilityBoundary:
                reconstruction.reconstruction?.responsibilityBoundary

        };



        runtimeResult.setPipeline(
            pipeline
        );


        runtimeResult.setTrace(
            trace
        );


        runtimeResult.identity =
            identity;


        runtimeResult.contract =
            RuntimeContract;


        runtimeResult.semanticObject =
            semanticObject;



        return runtimeResult;

    }

}


export default HonestRuntime;
