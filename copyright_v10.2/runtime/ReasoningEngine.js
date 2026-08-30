import EngineBase from "./EngineBase.js";

class ReasoningEngine extends EngineBase {

    constructor(semanticObject) {

        super(
            "ReasoningEngine",
            "7.0",
         "勿问分析证据对应关系中的推理边界，不让结论超过前提支持范围。"
        );

        this.semanticObject = semanticObject || {};

    }


    execute() {

        const metadata =
            this.buildMetadata();


        const reasonings =
            this.buildReasonings();


        const status =
            reasonings.length > 0
                ? "reasoning-evaluated"
                : "need-reasoning";


        return {

            engine:
                this.engine,


            version:
                this.version,


            semanticObject:
                this.semanticObject,


            principle:
                this.principle,


            metadata,


            reasonings,


            result: {

                metadata,

                reasonings,

                status

            },


            trace:
                this.semanticObject.runtimeTrace || [],


            questions:

                reasonings.length > 0

                    ? []

                    : [
                        "reasoning support verification required"
                    ],


            nextRuntimeState:
                "ResponsibilityEngine",


            status

        };

    }



    buildMetadata() {

        return {

            generatedAt:
                new Date().toISOString(),


            runtimeVersion:
                this.semanticObject.contract?.identity?.runtimeVersion || "",


            contractVersion:
                this.semanticObject.contract?.version || "",


            engineCount:

                Object.keys(

                    this.semanticObject.engines || {}

                ).length,


            traceCount:

                (this.semanticObject.runtimeTrace || []).length

        };

    }



    buildReasonings() {


        const correspondences =
            this.semanticObject.correspondences || [];


        return correspondences.map(item => {


            const assumptions =
                this.detectAssumptions(item);


            const leap =
                this.detectReasoningLeap(item);


            const strength =
                this.evaluateStrength(item);


            return {


                definition:
                    item.definition,


                evidences:
                    item.evidences || [],


                evidenceCount:
                    item.evidenceCount || 0,


                sourceAvailable:
                    item.sourceAvailable || false,


                sourceCount:
                    item.sourceCount || 0,


                supported:
                    item.supported || false,


                reasoningStrength:
                    strength,


                hiddenAssumptions:
                    assumptions,


                reasoningLeap:
                    leap,


                reasoningType:
                    "responsibility-bounded-reasoning",


                verificationStatus:

                    item.supported && item.sourceAvailable

                        ? "evaluated"

                        : "insufficient-support",


                runtimeTrace:
                    this.semanticObject.runtimeTrace || [],


                engineRegistry:

                    this.semanticObject.engineRegistry?.describe?.() || []

            };

        });

    }



    detectAssumptions(item) {


        const assumptions = [];


        if (

            item.definition &&
            item.evidenceCount === 0

        ) {

            assumptions.push(
                "当前定义缺少直接证据支持"
            );

        }


        return assumptions;

    }



    detectReasoningLeap(item) {


        const overreach =
            item.overreach || {};


        return {

            detected:
                overreach.detected || false,


            reason:
                overreach.reason || ""

        };

    }



    evaluateStrength(item) {


        if (

            item.supported &&
            item.sourceAvailable &&
            item.evidenceCount > 3

        ) {

            return "strong";

        }


        if (

            item.supported &&
            item.sourceAvailable

        ) {

            return "medium";

        }


        return "weak";

    }

}

export default ReasoningEngine;
