import HonestRuntime from "../runtime/HonestRuntime.js";
import TestCases from "./TestCases.js";

class TestRunner {

    run() {

        const results = [];

        let passed = 0;

        let failed = 0;


        for (const test of TestCases) {

            const runtime =
                new HonestRuntime(test.input);

            const output =
                runtime.run();


            const status =
                output?.selfCheck?.status === "self-check-passed"
                    ? "passed"
                    : "failed";


            if (status === "passed") {

                passed++;

            } else {

                failed++;

            }


            results.push({

                name: test.name,

                input: test.input,

                output,

                status

            });

        }


        return {

            version: "2.0",

            total: results.length,

            passed,

            failed,

            results

        };

    }

}

export default TestRunner;
