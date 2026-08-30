import UniversalExpression from "./UniversalExpression.js";


class Testimony {

    constructor(input = null) {

        this.type =
            "Testimony";

        this.version =
            "2.0";

        this.createdAt =
            new Date().toISOString();

        this.originalInput =
            input;

        this.content =
            input instanceof UniversalExpression
                ? input.originalExpression
                : input;

        /*
         * The language system belongs to the
         * external expression environment.
         *
         * Testimony preserves the supplied system.
         * Wuwen does not own or interpret it.
         */

        this.language =
            input instanceof UniversalExpression
                ? input.sourceLanguage
                : null;

        this.expressionType =
            null;

        this.objects =
            [];

        this.concepts =
            [];

        this.universalExpression =
            input instanceof UniversalExpression
                ? input
                : null;

    }

}


export default Testimony;
