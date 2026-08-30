class ReportFormatter {

    constructor(runtimeResult) {

        this.runtimeResult = runtimeResult || {};

    }

    run() {

        return {

            version:
                "8.2",

            principle:
                "勿问只整理运行结果，不增加新的判断。",

            metadata: {

                generatedAt:
                    this.runtimeResult.generatedAt,

                runtimeVersion:
                    this.runtimeResult.runtimeVersion,

                contractVersion:
                    this.runtimeResult.metadata?.contractVersion || null,

                engineCount:
                    this.runtimeResult.metadata?.engineCount || 0

            },

            report:
                this.runtimeResult,

            status:

                this.runtimeResult.selfCheck?.passed

                    ? "report-generated"

                    : "report-warning",

            questions:

                this.runtimeResult.selfCheck?.questions || [],

            trace:

                this.runtimeResult.runtimeTrace ||

                []

        };

    }

}

export default ReportFormatter;