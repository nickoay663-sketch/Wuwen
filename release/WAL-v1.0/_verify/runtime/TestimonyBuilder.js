import Testimony from "./Testimony.js";
import UniversalExpression from "./UniversalExpression.js";

class TestimonyBuilder {

    constructor(input) {

        this.input =
            input;

    }


    run() {

        const universalExpression =
            this.input instanceof UniversalExpression
                ? this.input
                : null;


        const testimony =
            new Testimony(
                universalExpression
                || this.input
            );


        if (universalExpression) {

            testimony.expressionType =
                "UniversalExpression";


            testimony.universalExpression =
                universalExpression;


            testimony.metadata = {

                sourceLanguage:
                    universalExpression.sourceLanguage,

                originalExpression:
                    universalExpression.originalExpression

            };

        }


        return testimony;

    }

}


export default TestimonyBuilder;
