import HonestRuntime from "./HonestRuntime.js";
import ReportFormatter from "./ReportFormatter.js";
import RuntimeContract from "./RuntimeContract.js";

class MoWenRuntime {

    constructor(
        expression,
        options = {}
    ) {

        this.expression =
            expression || "";

        this.options =
            options || {};

        this.version =
            RuntimeContract.version;

    }


    async run() {

        const runtimeResult =
            await new HonestRuntime(
                this.expression,
                this.options
            ).run();

        const report =
            new ReportFormatter(
                runtimeResult
            ).run();

        return {

            version:
                this.version,

            metadata: {

                runtimeVersion:
                    this.version,

                contractVersion:
                    RuntimeContract.version,

                generatedAt:
                    new Date().toISOString()

            },

            runtimeResult,

            report

        };

    }

}


export default MoWenRuntime;
