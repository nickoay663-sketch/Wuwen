const RuntimeContract = {

    version:
        "10.2",


    principles: {

        definition:
            "没有定义，就没有推理。",


        runtime:
            "没有 Contract，就没有 Runtime。",


        registry:
            "没有注册，就没有可信运行。",


        result:
            "没有 RuntimeResult，就没有统一运行结果。"

    },


    identity: {

        name:
            "Wuwen Runtime",


        runtimeVersion:
            "10.2",


        contractVersion:
            "10.2"

    },


    pipeline: {

        input:
            "Expression",


        output:
            "RuntimeResult",


        engines: [

            "RecognitionEngine",

            "DefinitionEngine",

            "SearchEngine",

            "EvidenceEngine",

            "CorrespondenceEngine",

            "ReasoningEngine",

            "ResponsibilityEngine",

            "ReconstructionEngine",

            "GeneratorEngine",

            "SelfCheckEngine"

        ]

    },


    engineContract: {

        version:
            "2.1",


        requiredFields: [

            "engine",

            "version",

            "status",

            "result",

            "trace",

            "questions",

            "nextRuntimeState",

            "principle",

            "metadata"

        ],


        fieldTypes: {

            engine:
                "string",


            version:
                "string",


            status:
                "string",


            principle:
                "string",


            metadata:
                "object",


            result:
                "object",


            trace:
                "array",


            questions:
                "array",


            nextRuntimeState:
                "string"

        }

    },


    runtimeResultContract: {

        requiredFields: [

            "runtimeVersion",

            "generatedAt",

            "metadata",

            "recognition",

            "definition",

            "search",

            "evidence",

            "correspondence",

            "reasoning",

            "responsibility",

            "reconstruction",

            "generator",

            "selfCheck",

            "runtimeTrace",

            "pipeline",

            "engineRegistry"

        ]

    },


    metadataContract: {

        requiredFields: [

            "runtimeVersion",

            "contractVersion",

            "engineCount",

            "generatedAt"

        ]

    },


    registryContract: {

        required:
            true,


        requiredMetadataFields: [

            "name",

            "version",

            "status",

            "nextRuntimeState",

            "capabilities"

        ]

    },


    executionContract: {

        required:
            true,


        principle:

            "Every Engine must provide a unified execution capability."


    }

};


export default RuntimeContract;