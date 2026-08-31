import RuntimeContract from "./RuntimeContract.js";
import EngineBase from "./EngineBase.js";

class EngineRegistry {

    constructor() {

        this.engines = {};

    }


    register(
        name,
        engine,
        executionResult = {}
    ) {

        if (
            typeof name !== "string" ||
            name.length === 0 ||
            !(engine instanceof EngineBase)
        ) {

            return false;

        }

        const result =
            executionResult &&
            typeof executionResult === "object"
                ? executionResult
                : {};

        this.engines[name] = {

            name,

            engine,

            version:
                result.version ||
                engine.version ||
                "",

            status:
                result.status ||
                engine.status ||
                "",

            nextRuntimeState:
                result.nextRuntimeState ||
                engine.nextRuntimeState ||
                "",

            capabilities:
                Array.isArray(engine.capabilities)
                    ? engine.capabilities
                    : [],

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

        return Object.values(
            this.engines
        ).map(
            item => ({

                name:
                    item.name,

                version:
                    item.version,

                status:
                    item.status,

                nextRuntimeState:
                    item.nextRuntimeState,

                capabilities:
                    Array.isArray(item.capabilities)
                        ? [...item.capabilities]
                        : [],

                registeredAt:
                    item.registeredAt

            })
        );

    }


    has(name) {

        return !!this.engines[name];

    }


    list() {

        return Object.keys(this.engines);

    }


    execute(
        name,
        context = {}
    ) {

        const item =
            this.engines[name];

        if (!item) {

            throw new Error(
                `EngineRegistry: unknown engine "${name}"`
            );

        }

        const engine =
            item.engine;

        if (
            !(engine instanceof EngineBase)
        ) {

            throw new Error(
                `EngineRegistry: "${name}" is not a valid EngineBase instance`
            );

        }

        if (
            typeof engine.execute !==
            "function"
        ) {

            throw new Error(
                `EngineRegistry: "${name}" must implement execute()`
            );

        }

        if (
            context !== null &&
            typeof context === "object"
        ) {

            engine.runtimeContext =
                context;

        }

        const result =
            engine.execute();

        if (
            !result ||
            typeof result !== "object"
        ) {

            throw new Error(
                `EngineRegistry: "${name}" returned an invalid execution result`
            );

        }

        return result;

    }


    validateVersions(
        contractVersion
    ) {

        const report = {

            passed:
                true,

            contractVersion,

            versions: {}

        };

        for (
            const [name, item]
            of Object.entries(
                this.engines
            )
        ) {

            const version =
                item.version ||
                "unknown";

            const valid =
                typeof version === "string" &&
                version.length > 0 &&
                version !== "unknown";

            report.versions[name] = {

                version,

                valid

            };

            if (!valid) {

                report.passed =
                    false;

            }

        }

        return report;

    }


    statistics() {

        const engines =
            Object.values(
                this.engines
            );

        return {

            total:
                engines.length,

            versions:
                engines.map(
                    item =>
                        item.version
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
        ).map(
            item => {

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

            }
        );

    }


    validate() {

        const registryContract =
            RuntimeContract
                ?.registryContract || {};

        const requiredFields =
            Array.isArray(
                registryContract
                    .requiredMetadataFields
            )
                ? registryContract
                    .requiredMetadataFields
                : [
                    "name",
                    "version",
                    "status",
                    "nextRuntimeState",
                    "capabilities"
                ];

        const result = {

            passed:
                true,

            contractVersion:
                RuntimeContract?.version,

            requiredFields,

            engines: {}

        };

        for (
            const [name, item]
            of Object.entries(
                this.engines
            )
        ) {

            const missing = [];
            const invalid = [];

            for (
                const field
                of requiredFields
            ) {

                if (
                    item[field] ===
                        undefined ||
                    item[field] ===
                        null ||
                    item[field] === ""
                ) {

                    missing.push(field);

                    continue;

                }

                if (
                    field ===
                        "capabilities" &&
                    !Array.isArray(
                        item[field]
                    )
                ) {

                    invalid.push(field);

                }

                if (
                    [
                        "name",
                        "version",
                        "status",
                        "nextRuntimeState"
                    ].includes(field) &&
                    typeof item[field] !==
                        "string"
                ) {

                    invalid.push(field);

                }

            }

            const executionValid =
                item.engine instanceof
                    EngineBase &&
                typeof item.engine.execute ===
                    "function";

            if (!executionValid) {

                invalid.push(
                    "execution"
                );

            }

            const compliant =
                missing.length === 0 &&
                invalid.length === 0;

            result.engines[name] = {

                compliance:
                    compliant,

                missing,

                invalid,

                version:
                    item.version,

                status:
                    item.status,

                nextRuntimeState:
                    item.nextRuntimeState,

                capabilityCount:
                    Array.isArray(
                        item.capabilities
                    )
                        ? item.capabilities.length
                        : 0,

                executionValid,

                registeredAt:
                    item.registeredAt

            };

            if (!compliant) {

                result.passed =
                    false;

            }

        }

        return result;

    }

}


export default EngineRegistry;
