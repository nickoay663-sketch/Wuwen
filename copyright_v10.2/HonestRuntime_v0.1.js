// Wuwen Honest Runtime v0.1

class HonestRuntime {

    constructor(text) {
        this.text = text;

        this.result = {
            concept: [],
            definitions: [],
            evidence: [],
            correspondence: [],
            responsibility: [],
            generatedText: ""
        };
    }


    run() {

        this.identify();

        this.define();

        this.collectEvidence();

        this.checkCorrespondence();

        this.checkResponsibility();

        this.generate();

        return this.result;

    }


    identify() {

        this.result.concept.push({
            text: this.text,
            status: "identified"
        });

    }


    define() {

        this.result.definitions.push({
            status: "definition required"
        });

    }


    collectEvidence() {

        this.result.evidence.push({
            status: "evidence required"
        });

    }


    checkCorrespondence() {

        this.result.correspondence.push({
            status: "checking"
        });

    }


    checkResponsibility() {

        this.result.responsibility.push({
            status: "checking"
        });

    }


    generate() {

        this.result.generatedText =
            "经过诚实运行后的新文本";

    }

}


export default HonestRuntime;
