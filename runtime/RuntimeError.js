import RuntimeContract from "./RuntimeContract.js";

class RuntimeError {

    constructor(
        code,
        message,
        metadata = {}
    ) {

        this.version =
            RuntimeContract.identity?.runtimeVersion ||
            RuntimeContract.version ||
            "10.8";

        this.code =
            code;

        this.message =
            message;

        this.metadata = {

            timestamp:
                new Date().toISOString(),

            runtimeVersion:
                this.version,

            contractVersion:
                RuntimeContract.identity?.contractVersion ||
                RuntimeContract.version ||
                "10.8",

            ...metadata

        };

    }


    toJSON() {

        return {

            version:
                this.version,

            code:
                this.code,

            message:
                this.message,

            metadata:
                this.metadata

        };

    }

}


export default RuntimeError;
