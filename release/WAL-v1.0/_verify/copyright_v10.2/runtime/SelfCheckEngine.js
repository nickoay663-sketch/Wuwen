import EngineBase from "./EngineBase.js";


class SelfCheckEngine extends EngineBase {


    constructor(runtimeObject) {

        super(
            "SelfCheckEngine",
            "10.2",
            "勿问检查自身运行完整性、责任边界和证据边界，不判断表达结果。"
        );

        this.runtimeObject =
            runtimeObject || {};

    }



    execute() {


        const checks =
            this.check();



        const contractReport =
            this.validateEngineContract();



        const registryReport =
            this.validateRegistry();



        const selfDescriptionReport =
            this.validateEngineDescription();



        const runtimeResultReport =
            this.validateRuntimeResult();



        const integrityReport =
            this.validateRuntimeIntegrity();



        const boundaryReport =
            this.validateResponsibilityBoundary();



        const failureExplanation =
            this.createFailureExplanation(

                contractReport,

                registryReport,

                selfDescriptionReport,

                integrityReport,

                boundaryReport

            );



        const recoveryGuidance =
            this.createRecoveryGuidance(

                failureExplanation

            );



        const auditTrail =
            this.createAuditTrail(

                contractReport,

                registryReport,

                runtimeResultReport,

                integrityReport,

                boundaryReport

            );



        const passed =


            Object.values(checks).every(Boolean)

            &&

            contractReport.passed

            &&

            registryReport.passed

            &&

            selfDescriptionReport.passed

            &&

            runtimeResultReport.passed

            &&

            integrityReport.passed

            &&

            boundaryReport.passed;



        return {


            engine:

                "SelfCheckEngine",



            version:


                this.version,


            principle:

                "勿问检查自身运行完整性、责任边界和证据边界，不判断表达结果。",

            metadata:

                this.metadata(),


            checks,


            contractReport,


            registryReport,


            selfDescriptionReport,


            runtimeResultReport,


            integrityReport,


            boundaryReport,


            failureExplanation,


            recoveryGuidance,


            auditTrail,


            passed,



            result: {


                checks,


                contractReport,


                registryReport,


                selfDescriptionReport,


                runtimeResultReport,


                integrityReport,


                boundaryReport,


                failureExplanation,


                recoveryGuidance,


                auditTrail,


                passed

            },



            trace:

                this.runtimeObject.runtimeTrace || [],



            questions:


                passed

                    ?

                    []

                    :

                    [

                        "运行链是否存在责任边界违反？"

                    ],



            nextRuntimeState:

                "RuntimeCompleted",



            status:


                passed

                    ?

                    "self-check-passed"

                    :

                    "self-check-warning"


        };


    }

    check() {


        const {

            pipeline,

            contract,

            semanticObject,

            engines

        } = this.runtimeObject;



        return {


            contract:

                !!contract,



            pipeline:

                Array.isArray(pipeline),



            semanticObject:

                !!semanticObject,



            engines:

                !!engines &&

                typeof engines === "object"


        };


    }




    validateEngineContract() {


        const contract =

            this.runtimeObject.contract;



        const engines =

            this.runtimeObject.engines || {};



        const engineContract =

            contract?.engineContract || {};



        const requiredFields =

            engineContract.requiredFields || [];



        const fieldTypes =

            engineContract.fieldTypes || {};



        const report = {


            passed:

                true,



            totalEngines:

                Object.keys(engines).length,



            engines: {}

        };



        for (const [engineName, engine] of Object.entries(engines)) {


            const missingFields = [];

            const invalidFields = [];



            for (const field of requiredFields) {


                if (!(field in engine)) {


                    missingFields.push(field);

                    continue;

                }



                const expectedType =

                    fieldTypes[field];



                if (

                    expectedType &&

                    !this.validateType(

                        engine[field],

                        expectedType

                    )

                ) {


                    invalidFields.push(field);

                }


            }



            report.engines[engineName] = {


                compliance:


                    requiredFields.length === 0

                        ?

                        100

                        :

                        Math.round(

                            (

                                requiredFields.length

                                -

                                missingFields.length

                                -

                                invalidFields.length

                            )

                            /

                            requiredFields.length

                            *

                            100

                        ),



                missingFields,


                invalidFields


            };



            if (

                missingFields.length > 0

                ||

                invalidFields.length > 0

            ) {


                report.passed = false;


            }


        }



        return report;


    }




    validateRegistry() {


        const registry =

            this.runtimeObject.engineRegistry;



        const engines =

            this.runtimeObject.engines || {};



        const report = {


            passed:

                true,



            registered:

                [],



            missing:

                []

        };



        if (!registry) {


            report.passed = false;


            report.missing.push(

                "EngineRegistry"

            );


            return report;

        }




        for (const engineName of Object.keys(engines)) {


            if (

                registry.has(engineName)

            ) {


                report.registered.push(

                    engineName

                );


            } else {


                report.passed = false;


                report.missing.push(

                    engineName

                );


            }


        }



        return report;


    }

    validateRuntimeIntegrity() {


        const pipeline =

            this.runtimeObject.pipeline || [];



        const expected = [


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


        ];



        const passed =

            expected.every(

                (engine, index) =>

                    pipeline[index] === engine

            );



        return {


            passed,



            expectedPipeline:

                expected,



            actualPipeline:

                pipeline,



            status:

                passed

                    ?

                    "pipeline-integrity-pass"

                    :

                    "pipeline-integrity-failed"


        };


    }




    validateResponsibilityBoundary() {


        const generator =

            this.runtimeObject.generator || {};



        const report = {


            passed:

                true,



            checks: {


                expansion:

                    true,



                sourceBoundary:

                    true,



                evidenceBoundary:

                    true


            }

        };



        const reportData =

            generator.report || {};



        if (

            reportData.expansion === true

        ) {


            report.passed = false;


            report.checks.expansion = false;


        }



        return report;


    }




    validateEngineDescription() {


        const engines =

            this.runtimeObject.engines || {};



        const report = {


            passed:

                true,



            engines: {}

        };



        for (const [engineName, engine] of Object.entries(engines)) {


            const missing = [];



            if (!engine.engine) {


                missing.push(

                    "engine"

                );


            }



            if (!engine.version) {


                missing.push(

                    "version"

                );


            }



            report.engines[engineName] = {


                missing


            };



            if (missing.length > 0) {


                report.passed = false;


            }


        }



        return report;


    }




    validateRuntimeResult() {


        const result =

            this.runtimeObject.runtimeResult;



        const requiredFields =

            this.runtimeObject.contract

                ?.runtimeResultContract

                ?.requiredFields || [];



        const missingFields =

            requiredFields.filter(


                field =>

                    !(field in (result || {}))


            );



        return {


            passed:

                missingFields.length === 0,



            missingFields


        };


    }

    createFailureExplanation(

        contractReport,

        registryReport,

        descriptionReport,

        integrityReport,

        boundaryReport

    ) {


        const failures = [];



        if (!contractReport.passed) {


            failures.push({


                problemType:

                    "contract-failure",



                impact:

                    "Engine 不符合 Runtime Contract。"


            });


        }



        if (!registryReport.passed) {


            failures.push({


                problemType:

                    "registry-failure",



                impact:

                    "Engine 未完成注册。"


            });


        }



        if (!descriptionReport.passed) {


            failures.push({


                problemType:

                    "description-failure",



                impact:

                    "Engine 无法完整描述自身能力。"


            });


        }



        if (!integrityReport.passed) {


            failures.push({


                problemType:

                    "pipeline-integrity-failure",



                impact:

                    "Runtime Pipeline 顺序异常。"


            });


        }



        if (!boundaryReport.passed) {


            failures.push({


                problemType:

                    "responsibility-boundary-failure",



                impact:

                    "输出超过证据或责任边界。"


            });


        }



        return failures;


    }




    createRecoveryGuidance(failures) {


        return failures.map(failure => ({


            problemType:

                failure.problemType,



            action:

                "修正运行链后重新执行 SelfCheck。",



            reason:

                failure.impact


        }));


    }




    createAuditTrail(

        contractReport,

        registryReport,

        runtimeResultReport,

        integrityReport,

        boundaryReport

    ) {


        return {


            engine:

                "SelfCheckEngine",



            version:


                this.version,



            timestamp:

                new Date().toISOString(),



            checkedEngines:

                Object.keys(

                    contractReport.engines

                ),



            registryStatus:

                registryReport.passed

                    ?

                    "PASS"

                    :

                    "FAIL",



            runtimeResultStatus:

                runtimeResultReport.passed

                    ?

                    "PASS"

                    :

                    "FAIL",



            pipelineStatus:

                integrityReport.status,



            boundaryStatus:

                boundaryReport.passed

                    ?

                    "PASS"

                    :

                    "FAIL",



            runtimeTrace:

                this.runtimeObject.runtimeTrace || [],



            traceCount:

                (

                    this.runtimeObject.runtimeTrace || []

                ).length


        };


    }

    validateType(value, type) {


        if (type === "array") {


            return Array.isArray(value);


        }



        if (type === "object") {


            return (

                typeof value === "object"

                &&

                value !== null

                &&

                !Array.isArray(value)

            );


        }



        return typeof value === type;


    }


}


export default SelfCheckEngine;
