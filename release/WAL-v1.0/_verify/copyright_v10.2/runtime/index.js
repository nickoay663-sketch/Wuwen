import HonestRuntime from "./HonestRuntime.js";
import ReportFormatter from "./ReportFormatter.js";

class WuwenRuntime {

    constructor(expression) {

        this.expression =
            expression || "";

        this.version =
            "7.5";

    }

    run() {

        const runtimeResult =
            new HonestRuntime(this.expression)
                .run();

        const report =
            new ReportFormatter(runtimeResult)
                .run();

        return {

            version:
                this.version,

            metadata: {

                runtimeVersion:
                    "7.5",

                generatedAt:
                    new Date().toISOString()

            },

            runtimeResult,

            report

        };

    }

}

export {

    HonestRuntime,

    ReportFormatter

};

export default WuwenRuntime;
