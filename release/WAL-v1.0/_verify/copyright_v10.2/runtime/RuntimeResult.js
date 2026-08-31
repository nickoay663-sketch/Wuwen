class RuntimeResult {

    constructor() {

        this.runtimeVersion =
            "10.2";


        this.generatedAt =
            new Date().toISOString();


        this.recognition =
            null;


        this.definition =
            null;


        this.testimony =
            null;


        this.testimonyValidation =
            null;


        this.search =
            null;


        this.evidence =
            null;


        this.correspondence =
            null;


        this.reasoning =
            null;


        this.responsibility =
            null;


        this.responsibilityModel =
            null;


        this.reconstruction =
            null;


        this.generator =
            null;


        this.selfCheck =
            null;


        this.engineRegistry =
            null;


        this.testimonyChain =
            null;


        this.verificationBoundary =
            null;


        this.runtimeTrace =
            [];


        this.pipeline =
            [];


        this.metadata = {

            contractVersion:
                "10.2",


            runtimeVersion:
                "10.2",


            engineCount:
                0,


            generatedAt:
                this.generatedAt

        };

    }



    setMetadata(metadata = {}) {

        this.metadata = {

            ...this.metadata,

            ...metadata

        };


        return this;

    }



    setEngine(name, value) {

        this[name] =
            value;


        return this;

    }



    setTrace(trace = []) {

        this.runtimeTrace =
            trace;


        return this;

    }



    setPipeline(pipeline = []) {

        this.pipeline =
            pipeline;


        return this;

    }



    setResponsibilityModel(model = {}) {

        this.responsibilityModel =
            model;


        return this;

    }



    setTestimonyChain(chain = {}) {

        this.testimonyChain =
            chain;


        return this;

    }



    setVerificationBoundary(boundary = {}) {

        this.verificationBoundary =
            boundary;


        return this;

    }



    complete() {

        return {

            runtimeVersion:
                this.runtimeVersion,


            generatedAt:
                this.generatedAt,


            metadata:
                this.metadata,


            result:
                this

        };

    }


}


export default RuntimeResult;
