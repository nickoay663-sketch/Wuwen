class Testimony {

    constructor(input = null) {

        this.type =
            "Testimony";

        this.version =
            "1.0";

        this.createdAt =
            new Date().toISOString();

        this.originalInput =
            input;

        this.content =
            input;

        this.language =
            null;

        this.expressionType =
            null;

        this.objects =
            [];

        this.concepts =
            [];

        this.metadata =
            {};

    }

}

export default Testimony;
