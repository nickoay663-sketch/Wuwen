class EngineRegistry {

    constructor() {

        this.engines = {};

    }


    register(name, engine) {

        if (!name || !engine) {

            return false;

        }


        this.engines[name] = {

            name,

            engine,

            version:
                engine.version || "",

            status:
                engine.status || "",

            nextRuntimeState:
                engine.nextRuntimeState || "",

            capabilities:
                engine.capabilities || [],

            registeredAt:
                new Date().toISOString()

        };

        return true;

    }


    get(name) {

        return this.engines[name];

    }


    getEngine(name) {

        return this.engines[name]?.engine;

    }


    all() {

        return this.engines;

    }


    has(name) {

        return !!this.engines[name];

    }


    list() {

        return Object.keys(this.engines);

    }

    validateVersions(contractVersion) {

        const report = {

            passed:
                true,

            contractVersion,

            versions: {}

        };


        for (const [name, item] of Object.entries(this.engines)) {

            const version =
                item.version || "unknown";


            report.versions[name] = {

                version,

                valid:
                    version !== "unknown"

            };


            if (version === "unknown") {

                report.passed = false;

            }

        }


        return report;

    }



    statistics() {

        const engines =
            Object.values(this.engines);


        return {

            total:
                engines.length,

            versions:

                engines.map(

                    item => item.version

                ),

            capabilities:

                engines.reduce(

                    (count, item) =>

                        count +

                        item.capabilities.length,

                    0

                )

        };

    }

    describe() {

        return Object.values(

            this.engines

        ).map(item => {

            return {

                name:
                    item.name,

                version:
                    item.version,

                status:
                    item.status,

                nextRuntimeState:
                    item.nextRuntimeState,

                capabilities:
                    item.capabilities,

                registeredAt:
                    item.registeredAt

            };

        });

    }



    validate() {

        const result = {

            passed:
                true,

            engines: {}

        };


        for (const [name, item] of Object.entries(this.engines)) {

            const missing = [];


            if (!item.name) {

                missing.push("name");

            }


            if (!item.version) {

                missing.push("version");

            }


            if (!Array.isArray(item.capabilities)) {

                missing.push("capabilities");

            }


            result.engines[name] = {

                missing,

                version:
                    item.version,

                capabilityCount:
                    item.capabilities.length,

                registeredAt:
                    item.registeredAt

            };


            if (missing.length > 0) {

                result.passed = false;

            }

        }


        return result;

    }

}

export default EngineRegistry;
