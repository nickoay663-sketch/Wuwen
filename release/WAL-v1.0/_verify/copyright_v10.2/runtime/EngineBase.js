class EngineBase {

    constructor(
        engine,
        version,
        principle
    ) {

        this.engine =
            engine;

        this.version =
            version;

        this.principle =
            principle;

    }


    metadata(extra = {}) {

        return {

            generatedAt:
                new Date().toISOString(),

            runtimeVersion:
                this.version,

            ...extra

        };

    }


    result(data = {}) {

        return {

            engine:
                this.engine,

            version:
                this.version,

            principle:
                this.principle,

            status:
                "completed",

            trace:
                [],

            questions:
                [],

            nextRuntimeState:
                null,

            metadata:
                this.metadata(),

            ...data

        };

    }


    execute() {

        throw new Error(
            `${this.engine} must implement execute()`
        );

    }

}


export default EngineBase;
