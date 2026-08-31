import RuntimeContract from "./RuntimeContract.js";

class RuntimeLogger {

    static log(
        stage,
        message,
        metadata = {}
    ) {

        console.log({

            timestamp:
                new Date().toISOString(),

            runtimeVersion:
                RuntimeContract.identity?.runtimeVersion ||
                RuntimeContract.version ||
                "10.8",

            contractVersion:
                RuntimeContract.identity?.contractVersion ||
                RuntimeContract.version ||
                "10.8",

            stage,

            message,

            metadata

        });

    }


    static warn(
        stage,
        message,
        metadata = {}
    ) {

        console.warn({

            timestamp:
                new Date().toISOString(),

            runtimeVersion:
                RuntimeContract.identity?.runtimeVersion ||
                RuntimeContract.version ||
                "10.8",

            contractVersion:
                RuntimeContract.identity?.contractVersion ||
                RuntimeContract.version ||
                "10.8",

            stage,

            message,

            metadata

        });

    }


    static error(
        stage,
        message,
        metadata = {}
    ) {

        console.error({

            timestamp:
                new Date().toISOString(),

            runtimeVersion:
                RuntimeContract.identity?.runtimeVersion ||
                RuntimeContract.version ||
                "10.8",

            contractVersion:
                RuntimeContract.identity?.contractVersion ||
                RuntimeContract.version ||
                "10.8",

            stage,

            message,

            metadata

        });

    }

}


export default RuntimeLogger;
