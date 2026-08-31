import Testimony from "./Testimony.js";

class TestimonyBuilder {

    constructor(input) {

        this.input =
            input;

    }

    run() {

        return new Testimony(

            this.input

        );

    }

}

export default TestimonyBuilder;
