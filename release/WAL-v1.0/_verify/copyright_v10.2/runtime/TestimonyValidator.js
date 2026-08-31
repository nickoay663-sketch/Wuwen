class TestimonyValidator {

    constructor(testimony) {

        this.testimony =
            testimony;

    }

    run() {

        const passed =

            this.testimony

            &&

            this.testimony.type === "Testimony"

            &&

            typeof this.testimony.content === "string";

        return {

            engine:
                "TestimonyValidator",

            version:
                "1.0",

            status:

                passed

                    ? "Passed"

                    : "Failed",

            passed,

            result: {

                passed

            }

        };

    }

}

export default TestimonyValidator;
