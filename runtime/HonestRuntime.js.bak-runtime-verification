import LanguageAdapter from "./LanguageAdapter.js";
import RecognitionEngine from "./RecognitionEngine.js";
import DefinitionEngine from "./DefinitionEngine.js";
import SearchEngine from "./SearchEngine.js";
import EvidenceEngine from "./EvidenceEngine.js";
import CorrespondenceEngine from "./CorrespondenceEngine.js";
import ReasoningEngine from "./ReasoningEngine.js";
import ResponsibilityEngine from "./ResponsibilityEngine.js";
import ResponsibilityEvent from "./ResponsibilityEvent.js";
import ReconstructionEngine from "./ReconstructionEngine.js";
import GeneratorEngine from "./GeneratorEngine.js";
import SelfCheckEngine from "./SelfCheckEngine.js";
import MoWenIdentity from "./MoWenIdentity.js";
import RuntimeContract from "./RuntimeContract.js";
import EngineRegistry from "./EngineRegistry.js";
import RuntimeResult from "./RuntimeResult.js";
import TestimonyBuilder from "./TestimonyBuilder.js";
import TestimonyValidator from "./TestimonyValidator.js";
import CoreGovernance from "./CoreGovernance.js";
import UniversalExpression from "./UniversalExpression.js";

class HonestRuntime {

    constructor(expression, options = {}) {

        this.expression =
            typeof expression === "string"
                ? expression.trim()
                : String(expression ?? "").trim();

        this.options =
            options || {};

    }

    async run() {

        const governance =
            new CoreGovernance();

        const governanceResult =
            governance.enforce();

        if (governanceResult.passed !== true) {
            throw new Error(
                `MoWen Core Governance failed: ${JSON.stringify(
                    governanceResult
                )}`
            );
        }

        const trace = [];

        /*
         * ---------------------------------------------------------
         * Shared execution result object
         *
         * 所有 Engine 共用同一个 executionResults。
         *
         * SelfCheck 执行前：
         *   executionResults = 前 9 个 Engine 的结果
         *
         * SelfCheck 执行完成后：
         *   executionResults = 全部 10 个 Engine 的结果
         * ---------------------------------------------------------
         */

        const executionResults = {};

        const runtimeResult =
            new RuntimeResult();

        const runtimeVersion =
            RuntimeContract.identity.runtimeVersion;

        const pipeline = [

            "RecognitionEngine",
            "DefinitionEngine",
            "SearchEngine",
            "EvidenceEngine",
            "CorrespondenceEngine",
            "ReasoningEngine",
            "ResponsibilityEngine",
            "ReconstructionEngine",
            "GeneratorEngine",
            "SelfCheckEngine"

        ];

        const identity =
            new MoWenIdentity().run();

        const testimony =
            new TestimonyBuilder(
                UniversalExpression.from({
                    originalExpression:
                        this.expression,

                    sourceLanguage:
                        this.options.languageSystem ??
                        this.options.language ??
                        null
                })
            ).run();

        const testimonyValidation =
            new TestimonyValidator(
                testimony
            ).run();

        const languageSystem =
            this.options.languageSystem ??
            this.options.language ??
            null;

        const languageAdapter =
            new LanguageAdapter(
                languageSystem
            );

        const languageConnection =
            languageAdapter.connect(
                this.expression
            );

        const engineRegistry =
            new EngineRegistry();

        /*
         * ---------------------------------------------------------
         * Shared Semantic Object
         * ---------------------------------------------------------
         */

        const semanticObject = {

            originalContent:
                this.expression,

            languageSystem:
                languageConnection.languageSystem,

            languageAdapter:
                languageConnection,

            objects: [],

            concepts: [],

            searchResults:
                Array.isArray(
                    this.options.searchResults
                )
                    ? this.options.searchResults
                    : [],

            evidence:
                Array.isArray(
                    this.options.evidence
                )
                    ? this.options.evidence
                    : [],

            externalSearchAdapter:
                this.options.externalSearchAdapter ||
                null,

            externalSearchAdapterOptions:
                this.options.externalSearchAdapterOptions ||
                {},

            externalSourceConnector:
                this.options.externalSourceConnector ||
                null,

            testimony,
            testimonyValidation,

            identity,

            contract:
                RuntimeContract,

            engineRegistry,

            engines:
                executionResults,

            runtimeTrace:
                trace

        };

        const runtimeContext = {

            pipeline,

            contract:
                RuntimeContract,

            engineRegistry,

            semanticObject,

            runtimeResult,

            runtimeTrace:
                trace,

            engines:
                executionResults,

            recognition: null,
            definition: null,
            search: null,
            evidence: null,
            correspondence: null,
            reasoning: null,
            responsibility: null,
            reconstruction: null,
            generator: null,
            selfCheck: null,

            verificationBoundary: null,

            /*
             * -----------------------------------------------------
             * Runtime Lifecycle
             *
             * RuntimeExecuting:
             *   Runtime 正在执行。
             *
             * RuntimeAborted:
             *   最终关闭条件未满足，Runtime 被阻止返回。
             *
             * RuntimeClosed:
             *   所有最终关闭条件均满足。
             *
             * IMPORTANT:
             *
             * RuntimeClosed 只能在最终 Closure Gate
             * 通过之后写入。
             * -----------------------------------------------------
             */
            runtimeState:
                "RuntimeExecuting"

        };

        /*
         * ---------------------------------------------------------
         * Engine Instances
         * ---------------------------------------------------------
         */

        const recognitionEngine =
            new RecognitionEngine(
                this.expression,
                languageConnection.languageSystem
            );

        const definitionEngine =
            new DefinitionEngine(
                semanticObject
            );

        const searchEngine =
            new SearchEngine(
                semanticObject
            );

        const evidenceContext = {

            ...semanticObject,

            search: null,

            engineRegistry,

            engines:
                executionResults,

            runtimeTrace:
                trace,

            runtimeContext

        };

        const evidenceEngine =
            new EvidenceEngine(
                evidenceContext
            );

        const correspondenceContext = {

            ...semanticObject,

            definitions: [],

            evidences: [],

            engineRegistry,

            engines:
                executionResults,

            runtimeTrace:
                trace,

            runtimeContext

        };

        const correspondenceEngine =
            new CorrespondenceEngine(
                correspondenceContext
            );

        const reasoningContext = {

            ...semanticObject,

            correspondences: [],

            engineRegistry,

            engines:
                executionResults,

            runtimeTrace:
                trace,

            runtimeContext

        };

        const reasoningEngine =
            new ReasoningEngine(
                reasoningContext
            );

        const responsibilityContext = {

            ...semanticObject,

            reasonings: [],

            contract:
                RuntimeContract,

            engineRegistry,

            engines:
                executionResults,

            runtimeTrace:
                trace,

            runtimeContext

        };

        const responsibilityEngine =
            new ResponsibilityEngine(
                responsibilityContext
            );

        const reconstructionContext = {

            semanticObject,

            responsibility: null,

            contract:
                RuntimeContract,

            pipeline,

            runtimeTrace:
                trace,

            engineRegistry,

            engines:
                executionResults,

            runtimeContext

        };

        const reconstructionEngine =
            new ReconstructionEngine(
                reconstructionContext
            );

        const generatorContext = {

            semanticObject,

            responsibility: null,

            reconstruction: null,

            contract:
                RuntimeContract,

            pipeline,

            engines:
                executionResults,

            engineRegistry,

            runtimeTrace:
                trace,

            runtimeContext

        };

        const generatorEngine =
            new GeneratorEngine(
                generatorContext
            );

        const selfCheckContext = {

            pipeline,

            contract:
                RuntimeContract,

            engines:
                executionResults,

            engineRegistry,

            semanticObject,

            runtimeResult,

            evidence: null,

            correspondence: null,

            reasoning: null,

            responsibility: null,

            reconstruction: null,

            generator: null,

            verificationBoundary: null,

            runtimeTrace:
                trace

        };

        const selfCheckEngine =
            new SelfCheckEngine(
                selfCheckContext
            );

        const engineInstances = {

            recognition:
                recognitionEngine,

            definition:
                definitionEngine,

            search:
                searchEngine,

            evidence:
                evidenceEngine,

            correspondence:
                correspondenceEngine,

            reasoning:
                reasoningEngine,

            responsibility:
                responsibilityEngine,

            reconstruction:
                reconstructionEngine,

            generator:
                generatorEngine,

            selfCheck:
                selfCheckEngine

        };

        /*
         * ---------------------------------------------------------
         * Register ALL Engines before execution
         * ---------------------------------------------------------
         */

        for (
            const [name, engine]
            of Object.entries(engineInstances)
        ) {

            engine.runtimeContext =
                runtimeContext;

            engine.runtimeObject =
                runtimeContext;

            engineRegistry.register(
                name,
                engine,
                {

                    engine:
                        engine.name ||
                        name,

                    version:
                        engine.version,

                    status:
                        engine.status ||
                        "ready",

                    principle:
                        engine.principle,

                    result:
                        {},

                    trace:
                        trace,

                    questions:
                        [],

                    nextRuntimeState:
                        engine.nextRuntimeState ||
                        ""

                }
            );

        }

        const preExecutionRegistry =
            engineRegistry.list();

        if (
            preExecutionRegistry.length !==
            pipeline.length
        ) {

            throw new Error(
                `MoWen EngineRegistry pre-execution mismatch: expected ${pipeline.length}, got ${preExecutionRegistry.length}`
            );

        }

        /*
         * ---------------------------------------------------------
         * Execution helper
         * ---------------------------------------------------------
         */

        const executeEngine =
            async (
                name,
                engine,
                context = {}
            ) => {

                Object.assign(
                    runtimeContext,
                    context
                );

                engine.runtimeContext =
                    runtimeContext;

                engine.runtimeObject =
                    runtimeContext;

                const result =
                    await engine.execute();

                this.recordTrace(
                    trace,
                    result
                );

                /*
                 * Engine execution completes first.
                 *
                 * Only after execute() returns successfully
                 * may its result enter executionResults.
                 */
                executionResults[name] =
                    result;

                engineRegistry.register(
                    name,
                    engine,
                    result || {}
                );

                return result;

            };

        /*
         * ---------------------------------------------------------
         * Recognition
         * ---------------------------------------------------------
         */

        const recognition =
            await executeEngine(
                "recognition",
                recognitionEngine
            );

        runtimeContext.recognition =
            recognition;

        semanticObject.objects =
            recognition.objects || [];

        semanticObject.concepts =
            recognition.concepts || [];

        /*
         * ---------------------------------------------------------
         * Definition
         * ---------------------------------------------------------
         */

        const definition =
            await executeEngine(
                "definition",
                definitionEngine
            );

        runtimeContext.definition =
            definition;

        /*
         * ---------------------------------------------------------
         * Search
         * ---------------------------------------------------------
         */

        const search =
            await executeEngine(
                "search",
                searchEngine
            );

        runtimeContext.search =
            search;

        semanticObject.searchResults =
            Array.isArray(
                search?.results
            )
                ? search.results
                : semanticObject.searchResults;

        /*
         * ---------------------------------------------------------
         * Evidence
         * ---------------------------------------------------------
         */

        evidenceContext.search =
            search;

        const evidence =
            await executeEngine(
                "evidence",
                evidenceEngine
            );

        runtimeContext.evidence =
            evidence;

        /*
         * ---------------------------------------------------------
         * Correspondence
         * ---------------------------------------------------------
         */

        correspondenceContext.definitions =
            definition.definitions || [];

        correspondenceContext.evidences =
            evidence.evidences || [];

        const correspondence =
            await executeEngine(
                "correspondence",
                correspondenceEngine
            );

        runtimeContext.correspondence =
            correspondence;

        /*
         * ---------------------------------------------------------
         * Reasoning
         * ---------------------------------------------------------
         */

        reasoningContext.correspondences =
            correspondence.correspondences || [];

        const reasoning =
            await executeEngine(
                "reasoning",
                reasoningEngine
            );

        runtimeContext.reasoning =
            reasoning;

        /*
         * ---------------------------------------------------------
         * Responsibility
         * ---------------------------------------------------------
         */

        responsibilityContext.reasonings =
            reasoning.reasonings || [];

        const responsibility =
            await executeEngine(
                "responsibility",
                responsibilityEngine
            );

        runtimeContext.responsibility =
            responsibility;

        /*
         * ---------------------------------------------------------
         * Reconstruction
         * ---------------------------------------------------------
         */

        reconstructionContext.responsibility =
            responsibility;

        const reconstruction =
            await executeEngine(
                "reconstruction",
                reconstructionEngine
            );

        runtimeContext.reconstruction =
            reconstruction;

        /*
         * ---------------------------------------------------------
         * RuntimeResult provisional state
         * ---------------------------------------------------------
         */

        runtimeResult.runtimeVersion =
            runtimeVersion;

        runtimeResult.recognition =
            recognition;

        runtimeResult.definition =
            definition;

        runtimeResult.testimony =
            testimony;

        runtimeResult.testimonyValidation =
            testimonyValidation;

        runtimeResult.search =
            search;

        runtimeResult.evidence =
            evidence;

        runtimeResult.correspondence =
            correspondence;

        runtimeResult.reasoning =
            reasoning;

        runtimeResult.responsibility =
            responsibility;

        runtimeResult.responsibilityModel =
            responsibility.responsibilities || [];

        runtimeResult.reconstruction =
            reconstruction;

        runtimeResult.testimonyChain = {

            testimony,
            testimonyValidation,
            responsibility

        };

        runtimeResult.verificationBoundary = {

            evidenceBoundary:
                reconstruction.reconstruction?.boundaries?.evidence ||
                null,

            sourceBoundary:
                reconstruction.reconstruction?.boundaries?.source ||
                null,

            responsibilityBoundary:
                reconstruction.reconstruction?.boundaries?.responsibility ||
                null

        };

        runtimeContext.verificationBoundary =
            runtimeResult.verificationBoundary;

        runtimeResult.setPipeline(
            pipeline
        );

        runtimeResult.setTrace(
            trace
        );

        runtimeResult.identity =
            identity;

        runtimeResult.contract =
            RuntimeContract;

        runtimeResult.semanticObject =
            semanticObject;

        /*
         * ---------------------------------------------------------
         * Generator
         * ---------------------------------------------------------
         */

        generatorContext.responsibility =
            responsibility;

        generatorContext.reconstruction =
            reconstruction;

        const generator =
            await executeEngine(
                "generator",
                generatorEngine
            );

        runtimeContext.generator =
            generator;

        runtimeResult.generator =
            generator;

        /*
         * ---------------------------------------------------------
         * SelfCheck
         *
         * 此时：
         *
         * Registry:
         *   10 registered
         *
         * executionResults:
         *   9 completed
         *
         * selfCheck:
         *   pending
         *
         * 这是合法的 SelfCheck 生命周期状态。
         * ---------------------------------------------------------
         */

        selfCheckContext.evidence =
            evidence;

        selfCheckContext.correspondence =
            correspondence;

        selfCheckContext.reasoning =
            reasoning;

        selfCheckContext.responsibility =
            responsibility;

        selfCheckContext.reconstruction =
            reconstruction;

        selfCheckContext.generator =
            generator;

        selfCheckContext.verificationBoundary =
            runtimeResult.verificationBoundary;

        selfCheckContext.runtimeResult =
            runtimeResult;

        selfCheckEngine.runtimeContext =
            runtimeContext;

        selfCheckEngine.runtimeObject =
            runtimeContext;

        const selfCheck =
            await executeEngine(
                "selfCheck",
                selfCheckEngine
            );

        runtimeContext.selfCheck =
            selfCheck;

        runtimeResult.selfCheck =
            selfCheck;

        /*
         * ---------------------------------------------------------
         * SelfCheck Lifecycle Closure
         * ---------------------------------------------------------
         *
         * executeEngine() 已经完成：
         *
         * executionResults.selfCheck = selfCheck
         *
         * 因此此处只允许宣布：
         *
         * 10 / 10 execution-completed
         *
         * 注意：
         *
         * executionComplete != RuntimeClosed
         *
         * Engine 全部执行完成只是进入最终 Closure Gate，
         * 不能提前宣布 RuntimeClosed。
         * ---------------------------------------------------------
         */

        const finalRegistryState =
            engineRegistry.list();

        const finalExecutionCompleted =
            pipeline
                .map(
                    name =>
                        this.registryName(name)
                )
                .filter(
                    name =>
                        Object.prototype.hasOwnProperty.call(
                            executionResults,
                            name
                        )
                );

        const finalExecutionPending =
            pipeline
                .map(
                    name =>
                        this.registryName(name)
                )
                .filter(
                    name =>
                        !Object.prototype.hasOwnProperty.call(
                            executionResults,
                            name
                        )
                );

        const finalExecutionComplete =
            finalExecutionPending.length === 0 &&
            finalExecutionCompleted.length === pipeline.length;

        if (!finalExecutionComplete) {

            runtimeContext.runtimeState =
                "RuntimeAborted";

            runtimeResult.setMetadata({

                runtimeVersion,

                contractVersion:
                    RuntimeContract.version,

                runtimeState:
                    runtimeContext.runtimeState,

                executionCompleted:
                    finalExecutionCompleted,

                executionPending:
                    finalExecutionPending,

                executionComplete:
                    finalExecutionComplete

            });

            throw new Error(
                `MoWen Runtime execution lifecycle failed: ${JSON.stringify(
                    {
                        expectedCount:
                            pipeline.length,

                        completedCount:
                            finalExecutionCompleted.length,

                        executionCompleted:
                            finalExecutionCompleted,

                        executionPending:
                            finalExecutionPending,

                        runtimeState:
                            runtimeContext.runtimeState
                    }
                )}`
            );

        }

        /*
         * ---------------------------------------------------------
         * Registry validation
         *
         * 注意：
         *
         * 此处仍然不能写 RuntimeClosed。
         * Registry 必须先验证。
         * ---------------------------------------------------------
         */

        const registryState =
            finalRegistryState;

        const missingPipelineEngines =
            pipeline.filter(
                name =>
                    !registryState.includes(
                        this.registryName(name)
                    )
            );

        const registryValidation =
            engineRegistry.validate();

        const registryVersionValidation =
            engineRegistry.validateVersions(
                RuntimeContract.version
            );

        const registryComplete =
            missingPipelineEngines.length === 0 &&
            registryState.length === pipeline.length &&
            registryValidation.passed === true &&
            registryVersionValidation.passed === true;

        if (!registryComplete) {

            runtimeContext.runtimeState =
                "RuntimeAborted";

            runtimeResult.setMetadata({

                contractVersion:
                    RuntimeContract.version,

                runtimeVersion,

                engineCount:
                    registryState.length,

                registryValidation,

                registryVersionValidation,

                registryStateBeforeSelfCheck:
                    registryState,

                registryStateAfterSelfCheck:
                    engineRegistry.list(),

                executionCompleted:
                    finalExecutionCompleted,

                executionPending:
                    finalExecutionPending,

                executionCompletedCount:
                    finalExecutionCompleted.length,

                executionExpectedCount:
                    pipeline.length,

                executionComplete:
                    finalExecutionComplete,

                runtimeState:
                    runtimeContext.runtimeState,

                governance:
                    governanceResult

            });

            throw new Error(
                `MoWen EngineRegistry integrity failed: ${JSON.stringify(
                    {
                        pipeline,
                        registryState,
                        missingPipelineEngines,
                        registryValidation,
                        registryVersionValidation,
                        runtimeState:
                            runtimeContext.runtimeState
                    }
                )}`
            );

        }

        runtimeResult.setTrace(
            trace
        );

        /*
         * ---------------------------------------------------------
         * IMPORTANT:
         *
         * 到这里仍然是 RuntimeExecuting。
         *
         * SelfCheck 必须继续参与最终 Closure Gate。
         * ---------------------------------------------------------
         */

        runtimeResult.setMetadata({

            contractVersion:
                RuntimeContract.version,

            runtimeVersion,

            engineCount:
                registryState.length,

            registryValidation,

            registryVersionValidation,

            registryStateBeforeSelfCheck:
                registryState,

            registryStateAfterSelfCheck:
                engineRegistry.list(),

            executionCompleted:
                finalExecutionCompleted,

            executionPending:
                finalExecutionPending,

            executionCompletedCount:
                finalExecutionCompleted.length,

            executionExpectedCount:
                pipeline.length,

            executionComplete:
                finalExecutionComplete,

            runtimeState:
                runtimeContext.runtimeState,

            governance:
                governanceResult

        });

        runtimeResult.engineRegistry =
            engineRegistry.describe();

        /*
         * ---------------------------------------------------------
         * FINAL EPISTEMIC STATE
         * ---------------------------------------------------------
         */

        const finalEpistemicState =
            this.deriveFinalEpistemicState(
                responsibility,
                reasoning,
                selfCheck
            );

        runtimeResult.setEpistemicState(
            finalEpistemicState
        );

        const epistemicBoundary =
            runtimeResult.buildEpistemicBoundary();

        runtimeResult.setEpistemicBoundary({

            ...epistemicBoundary,

            finalState:
                finalEpistemicState,

            selfCheckPassed:
                selfCheck?.result?.passed === true,

            selfCheckStatus:
                selfCheck?.status ||
                "unknown"

        });

        /*
         * ---------------------------------------------------------
         * MWAL ResponsibilityEvent
         * ---------------------------------------------------------
         */

        const responsibilityEvent =
            new ResponsibilityEvent({

                expression:
                    this.expression,

                testimony,

                responsibility,

                evidence,

                correspondence,

                reasoning,

                epistemicState:
                    finalEpistemicState,

                verificationBoundary:
                    runtimeResult.verificationBoundary,

                runtimeTrace:
                    trace,

                runtimeVersion,

                contractVersion:
                    RuntimeContract.version,

                source:
                    "MoWen Runtime"

            });

        const responsibilityEventValidation =
            responsibilityEvent.validate();

        if (
            responsibilityEventValidation.passed !== true
        ) {

            runtimeContext.runtimeState =
                "RuntimeAborted";

            runtimeResult.setMetadata({

                contractVersion:
                    RuntimeContract.version,

                runtimeVersion,

                runtimeState:
                    runtimeContext.runtimeState,

                responsibilityEvent: {

                    validation:
                        responsibilityEventValidation

                }

            });

            throw new Error(
                `MoWen ResponsibilityEvent validation failed: ${JSON.stringify(
                    responsibilityEventValidation
                )}`
            );

        }

        const responsibilityEventPublishable =
            responsibilityEvent.isPublishable();

        runtimeResult.responsibilityEvent =
            responsibilityEvent;

        runtimeResult.responsibilityEventValidation =
            responsibilityEventValidation;

        runtimeResult.responsibilityEventPublishable =
            responsibilityEventPublishable;

        /*
         * ---------------------------------------------------------
         * FINAL Runtime Metadata
         *
         * 此时仍不能假设 RuntimeClosed。
         * 先记录 RuntimeExecuting。
         * 最终 Closure Gate 通过后再覆盖为 RuntimeClosed。
         * ---------------------------------------------------------
         */

        runtimeResult.setMetadata({

            contractVersion:
                RuntimeContract.version,

            runtimeVersion,

            engineCount:
                engineRegistry.list().length,

            registryValidation,

            registryVersionValidation,

            registryStateBeforeSelfCheck:
                registryState,

            registryStateAfterSelfCheck:
                engineRegistry.list(),

            executionCompleted:
                finalExecutionCompleted,

            executionPending:
                finalExecutionPending,

            executionCompletedCount:
                finalExecutionCompleted.length,

            executionExpectedCount:
                pipeline.length,

            executionComplete:
                finalExecutionComplete,

            runtimeState:
                runtimeContext.runtimeState,

            governance:
                governanceResult,

            responsibilityEvent: {

                type:
                    responsibilityEvent.type,

                version:
                    responsibilityEvent.version,

                epistemicState:
                    responsibilityEvent.epistemicState,

                publishable:
                    responsibilityEventPublishable,

                validation:
                    responsibilityEventValidation

            }

        });

        /*
         * ---------------------------------------------------------
         * FINAL Runtime Closure Assertion
         * ---------------------------------------------------------
         *
         * Runtime 只有同时满足：
         *
         * 1. Registry 10/10
         * 2. Execution 10/10
         * 3. SelfCheck passed
         *
         * 才允许写入：
         *
         *   RuntimeClosed
         *
         * 这是最终 Closure Gate。
         *
         * IMPORTANT:
         *
         * runtimeState 不再作为 Gate 的输入条件。
         * 因为 RuntimeClosed 是 Gate 的输出事实，
         * 不能要求“已经 Closed”才能证明“可以 Closed”。
         * ---------------------------------------------------------
         */

        const closureGatePassed =
            registryState.length === pipeline.length &&
            finalExecutionCompleted.length === pipeline.length &&
            finalExecutionPending.length === 0 &&
            selfCheck?.result?.passed === true;

        if (!closureGatePassed) {

            runtimeContext.runtimeState =
                "RuntimeAborted";

            runtimeResult.setMetadata({

                contractVersion:
                    RuntimeContract.version,

                runtimeVersion,

                engineCount:
                    engineRegistry.list().length,

                registryValidation,

                registryVersionValidation,

                registryStateBeforeSelfCheck:
                    registryState,

                registryStateAfterSelfCheck:
                    engineRegistry.list(),

                executionCompleted:
                    finalExecutionCompleted,

                executionPending:
                    finalExecutionPending,

                executionCompletedCount:
                    finalExecutionCompleted.length,

                executionExpectedCount:
                    pipeline.length,

                executionComplete:
                    finalExecutionComplete,

                runtimeState:
                    runtimeContext.runtimeState,

                governance:
                    governanceResult,

                responsibilityEvent: {

                    type:
                        responsibilityEvent.type,

                    version:
                        responsibilityEvent.version,

                    epistemicState:
                        responsibilityEvent.epistemicState,

                    publishable:
                        responsibilityEventPublishable,

                    validation:
                        responsibilityEventValidation

                }

            });

            throw new Error(
                `MoWen Runtime closure failed: ${JSON.stringify(
                    {
                        registryCount:
                            registryState.length,

                        expectedCount:
                            pipeline.length,

                        executionCompleted:
                            finalExecutionCompleted,

                        executionPending:
                            finalExecutionPending,

                        selfCheckPassed:
                            selfCheck?.result?.passed === true,

                        selfCheckChecks:
                            selfCheck?.result?.checks ||
                            selfCheck?.checks ||
                            null,

                        selfCheckFailures:
                            selfCheck?.result?.failureExplanation ||
                            selfCheck?.failureExplanation ||
                            null,

                        selfCheckReports: {

                            contract:
                                selfCheck?.result?.contractReport ||
                                selfCheck?.contractReport ||
                                null,

                            registry:
                                selfCheck?.result?.registryReport ||
                                selfCheck?.registryReport ||
                                null,

                            selfDescription:
                                selfCheck?.result?.selfDescriptionReport ||
                                selfCheck?.selfDescriptionReport ||
                                null,

                            runtimeResult:
                                selfCheck?.result?.runtimeResultReport ||
                                selfCheck?.runtimeResultReport ||
                                null,

                            integrity:
                                selfCheck?.result?.integrityReport ||
                                selfCheck?.integrityReport ||
                                null,

                            responsibilityBoundary:
                                selfCheck?.result?.boundaryReport ||
                                selfCheck?.boundaryReport ||
                                null,

                            publicationBoundary:
                                selfCheck?.result?.publicationBoundaryReport ||
                                selfCheck?.publicationBoundaryReport ||
                                null,

                            epistemicBoundary:
                                selfCheck?.result?.epistemicReport ||
                                selfCheck?.epistemicReport ||
                                null,

                            externalLanguageBoundary:
                                selfCheck?.result?.languageBoundaryReport ||
                                selfCheck?.languageBoundaryReport ||
                                null

                        },

                        runtimeState:
                            runtimeContext.runtimeState

                    }
                )}`
            );

        }

        /*
         * ---------------------------------------------------------
         * FINAL RUNTIME CLOSURE
         *
         * Closure Gate 必须先通过。
         *
         * 只有在以下条件全部成立后：
         *
         *   Registry 完整
         *   Execution 全部完成
         *   Execution Pending = 0
         *   SelfCheck = passed
         *
         * 才允许写入：
         *
         *   RuntimeClosed
         *
         * ---------------------------------------------------------
         */

        const runtimeClosed =
            registryState.length === pipeline.length &&
            finalExecutionCompleted.length === pipeline.length &&
            finalExecutionPending.length === 0 &&
            selfCheck?.result?.passed === true;

        /*
         * ---------------------------------------------------------
         * Final closure invariant
         *
         * 这里验证“是否具备关闭资格”。
         *
         * 此时 RuntimeState 仍然不能作为判断条件，
         * 因为 RuntimeClosed 尚未写入。
         *
         * 先检验，再写入。
         * ---------------------------------------------------------
         */

        if (!runtimeClosed) {

            runtimeContext.runtimeState =
                "RuntimeAborted";

            runtimeResult.setMetadata({

                contractVersion:
                    RuntimeContract.version,

                runtimeVersion,

                runtimeState:
                    runtimeContext.runtimeState,

                executionCompleted:
                    finalExecutionCompleted,

                executionPending:
                    finalExecutionPending,

                executionComplete:
                    finalExecutionComplete

            });

            throw new Error(
                `MoWen Runtime closure invariant failed: ${JSON.stringify(
                    {
                        registryCount:
                            registryState.length,

                        expectedCount:
                            pipeline.length,

                        executionCompleted:
                            finalExecutionCompleted,

                        executionPending:
                            finalExecutionPending,

                        selfCheckPassed:
                            selfCheck?.result?.passed === true,

                        runtimeState:
                            runtimeContext.runtimeState
                    }
                )}`
            );

        }

        /*
         * ---------------------------------------------------------
         * ONLY NOW:
         *
         * Closure Gate 已经通过。
         *
         * 才正式写入 RuntimeClosed。
         * ---------------------------------------------------------
         */

        runtimeContext.runtimeState =
            "RuntimeClosed";

        runtimeResult.setMetadata({

            contractVersion:
                RuntimeContract.version,

            runtimeVersion,

            engineCount:
                engineRegistry.list().length,

            registryValidation,

            registryVersionValidation,

            registryStateBeforeSelfCheck:
                registryState,

            registryStateAfterSelfCheck:
                engineRegistry.list(),

            executionCompleted:
                finalExecutionCompleted,

            executionPending:
                finalExecutionPending,

            executionCompletedCount:
                finalExecutionCompleted.length,

            executionExpectedCount:
                pipeline.length,

            executionComplete:
                finalExecutionComplete,

            runtimeState:
                runtimeContext.runtimeState,

            runtimeClosed,

            governance:
                governanceResult,

            responsibilityEvent: {

                type:
                    responsibilityEvent.type,

                version:
                    responsibilityEvent.version,

                epistemicState:
                    responsibilityEvent.epistemicState,

                publishable:
                    responsibilityEventPublishable,

                validation:
                    responsibilityEventValidation

            }

        });

        return runtimeResult;

    }


    registryName(pipelineName) {

        const map = {

            RecognitionEngine:
                "recognition",

            DefinitionEngine:
                "definition",

            SearchEngine:
                "search",

            EvidenceEngine:
                "evidence",

            CorrespondenceEngine:
                "correspondence",

            ReasoningEngine:
                "reasoning",

            ResponsibilityEngine:
                "responsibility",

            ReconstructionEngine:
                "reconstruction",

            GeneratorEngine:
                "generator",

            SelfCheckEngine:
                "selfCheck"

        };

        return map[pipelineName] ||
            pipelineName;

    }


    deriveFinalEpistemicState(
        responsibility,
        reasoning,
        selfCheck
    ) {

        if (
            selfCheck?.result?.passed !== true
        ) {

            return "UNKNOWN";

        }

        const responsibilityState =
            responsibility?.epistemicState ||
            responsibility?.result?.epistemicState ||
            responsibility?.responsibilities?.[0]?.epistemicState ||
            responsibility?.result?.responsibilities?.[0]?.epistemicState ||
            null;

        const reasoningState =
            reasoning?.epistemicState ||
            reasoning?.result?.epistemicState ||
            reasoning?.reasonings?.[0]?.epistemicState ||
            reasoning?.result?.reasonings?.[0]?.epistemicState ||
            null;

        const candidate =
            responsibilityState ||
            reasoningState ||
            "UNKNOWN";

        const allowedStates = [

            "DISCOVERED",
            "UNVERIFIED",
            "VERIFIED",
            "VERIFIED_BUT_NOT_LINKED",
            "SUPPORTED",
            "CONTRADICTED",
            "PARTIAL",
            "UNRESOLVED",
            "OUT_OF_DOMAIN",
            "UNKNOWN"

        ];

        if (
            allowedStates.includes(candidate)
        ) {

            return candidate;

        }

        return "UNKNOWN";

    }


    recordTrace(trace, result) {

        if (!result) {
            return;
        }

        trace.push({

            engine:
                result.engine,

            status:
                result.status,

            version:
                result.version

        });

    }

}

export default HonestRuntime;




