import EngineBase from "./EngineBase.js";

class GeneratorEngine extends EngineBase {

    constructor(runtimeObject) {

        super(
            "GeneratorEngine",
            "7.0",
        "勿问生成责任链报告，不生成超过验证范围的结论。"
        );

        this.runtimeObject = runtimeObject || {};

    }

    execute() {

        const metadata =
            this.buildMetadata();

        const report =
            this.buildReport();

        return {

            engine:
                this.engine,

            version:
                this.version,

            semanticObject:
                this.runtimeObject.semanticObject,

            principle:
                this.principle,

            generator:
                true,

            metadata,

            report,

            result: {

                metadata,

                report,

                generator:
                    true

            },

            trace:
                this.runtimeObject.runtimeTrace || [],

            questions:
                [],

            nextRuntimeState:
                "SelfCheckEngine",

            status:

                report.responsibilityCount > 0

                    ? "generator-evaluated"

                    : "need-report-data"

        };

    }

    buildMetadata() {

        return {

            generatedAt:
                new Date().toISOString(),

            runtimeVersion:
                this.runtimeObject.contract?.identity?.runtimeVersion || "",

            contractVersion:
                this.runtimeObject.contract?.version || "",

            pipeline:
                this.runtimeObject.pipeline || [],

            engineCount:

                Object.keys(

                    this.runtimeObject.engines || {}

                ).length,

            traceCount:

                (this.runtimeObject.runtimeTrace || []).length

        };

    }

    buildReport() {

        const reconstruction =

            this.runtimeObject.reconstruction?.reconstruction || {};

        return {

            expression:

                reconstruction.originalExpression || "",

            reconstructedExpression:

                reconstruction.reconstructedExpression || "",

            language:

                reconstruction.language || null,

            responsibilities:

                reconstruction.responsibilityChain ||

                reconstruction.responsibilities ||

                [],

            responsibilityCount:

                reconstruction.responsibilityCount || 0,

            evidenceChain:

                reconstruction.evidenceChain || [],

            sources:

                reconstruction.sources || [],

            sourceCount:

                reconstruction.sourceCount || 0,

            boundaries:

                reconstruction.boundaries ||

                {},

            expansion:

                reconstruction.expansion || false,

            reportType:

                "responsibility-verification-report",

            verificationStatus:

                reconstruction.verificationStatus || "pending",

            runtimeTrace:

                this.runtimeObject.runtimeTrace || [],

            engineRegistry:

                this.runtimeObject.engineRegistry?.describe?.() || []

        };

    }

}

export default GeneratorEngine;
