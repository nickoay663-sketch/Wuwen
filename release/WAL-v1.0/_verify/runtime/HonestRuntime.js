import LanguageAdapter from "./LanguageAdapter.js";
import RecognitionEngine from "./RecognitionEngine.js";
import DefinitionEngine from "./DefinitionEngine.js";
import SearchEngine from "./SearchEngine.js";
import EvidenceEngine from "./EvidenceEngine.js";
import RuntimeVerificationEngine, { createRuntimeVerificationAuthority } from "./RuntimeVerificationEngine.js";
import CorrespondenceEngine from "./CorrespondenceEngine.js";
import ReasoningEngine from "./ReasoningEngine.js";
import ResponsibilityEngine from "./ResponsibilityEngine.js";
import ResponsibilityEvent from "./ResponsibilityEvent.js";
import ReconstructionEngine from "./ReconstructionEngine.js";
import GeneratorEngine from "./GeneratorEngine.js";
import SelfCheckEngine from "./SelfCheckEngine.js";
import WuwenIdentity from "./WuwenIdentity.js";
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
                `Wuwen Core Governance failed: ${JSON.stringify(
                    governanceResult
                )}`
            );
        }

        const trace = [];

        /*
         * ---------------------------------------------------------
         * Shared execution result object
         *
         * 鎵€鏈?Engine 鍏辩敤鍚屼竴涓?executionResults銆?
         *
         * SelfCheck 鎵ц鍓嶏細
         *   executionResults = 鍓?9 涓?Engine 鐨勭粨鏋?
         *
         * SelfCheck 鎵ц瀹屾垚鍚庯細
         *   executionResults = 鍏ㄩ儴 10 涓?Engine 鐨勭粨鏋?
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
            "RuntimeVerificationEngine",
            "CorrespondenceEngine",
            "ReasoningEngine",
            "ResponsibilityEngine",
            "ReconstructionEngine",
            "GeneratorEngine",
            "SelfCheckEngine"

        ];

        const identity =
            new WuwenIdentity().run();

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
            new TestimonyValidator(testimony).validateAll();

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
         * Runtime Verification Authority
         * ---------------------------------------------------------
         *
         * Authority 鍙兘鐢?HonestRuntime 鍒涘缓銆?
         *
         * RuntimeVerificationEngine锛?
         *   - 涓嶈兘鑷繁鍒涘缓 Authority
         *   - 涓嶈兘浠?runtimeContext 璇诲彇浼€?Authority
         *   - 涓嶈兘鎺ュ彈鏅€氬璞″啋鍏?Authority
         *
         * 鍙湁姝ゅ鍒涘缓鐨?opaque authority token
         * 鎵嶈兘鍏佽 Runtime Verification 浜х敓 VERIFIED銆?
         * ---------------------------------------------------------
         */

        const runtimeVerificationAuthority =
            createRuntimeVerificationAuthority();

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
             *   Runtime 姝ｅ湪鎵ц銆?
             *
             * RuntimeAborted:
             *   鏈€缁堝叧闂潯浠舵湭婊¤冻锛孯untime 琚樆姝㈣繑鍥炪€?
             *
             * RuntimeClosed:
             *   鎵€鏈夋渶缁堝叧闂潯浠跺潎婊¤冻銆?
             *
             * IMPORTANT:
             *
             * RuntimeClosed 鍙兘鍦ㄦ渶缁?Closure Gate
             * 閫氳繃涔嬪悗鍐欏叆銆?
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

        const runtimeVerificationContext = {
            ...semanticObject,

            evidences:
                evidenceContext.evidences || [],

            engineRegistry,

            engines:
                executionResults,

            runtimeTrace:
                trace,

            runtimeContext,

            runtimeVerificationAuthority

        };

        const runtimeVerificationEngine =
            new RuntimeVerificationEngine(
                runtimeVerificationContext
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

            runtimeVerification:
                runtimeVerificationEngine,

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
                `Wuwen EngineRegistry pre-execution mismatch: expected ${pipeline.length}, got ${preExecutionRegistry.length}`
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
         * Runtime Verification
         * ---------------------------------------------------------
         */

        runtimeVerificationContext.evidences =
            evidence.evidences || [];

        runtimeVerificationEngine.context =
            runtimeVerificationContext;

        const runtimeVerification =
            await executeEngine(
                "runtimeVerification",
                runtimeVerificationEngine
            );

        runtimeContext.runtimeVerification =
            runtimeVerification;

        /*
         * ---------------------------------------------------------
         * Correspondence
         * ---------------------------------------------------------
         */

        correspondenceContext.definitions =
            definition.definitions || [];

        correspondenceContext.evidences =
            runtimeVerification.evidences || [];

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
            runtimeVerification;

        runtimeResult.runtimeVerification =
            runtimeVerification;

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

            runtimeVerificationBoundary:
                runtimeVerification.verificationBoundary ||
                null,

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
         * 姝ゆ椂锛?
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
         * 杩欐槸鍚堟硶鐨?SelfCheck 鐢熷懡鍛ㄦ湡鐘舵€併€?
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
         * executeEngine() 宸茬粡瀹屾垚锛?
         *
         * executionResults.selfCheck = selfCheck
         *
         * 鍥犳姝ゅ鍙厑璁稿甯冿細
         *
         * 10 / 10 execution-completed
         *
         * 娉ㄦ剰锛?
         *
         * executionComplete != RuntimeClosed
         *
         * Engine 鍏ㄩ儴鎵ц瀹屾垚鍙槸杩涘叆鏈€缁?Closure Gate锛?
         * 涓嶈兘鎻愬墠瀹ｅ竷 RuntimeClosed銆?
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
                `Wuwen Runtime execution lifecycle failed: ${JSON.stringify(
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
         * 娉ㄦ剰锛?
         *
         * 姝ゅ浠嶇劧涓嶈兘鍐?RuntimeClosed銆?
         * Registry 蹇呴』鍏堥獙璇併€?
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
                `Wuwen EngineRegistry integrity failed: ${JSON.stringify(
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
         * 鍒拌繖閲屼粛鐒舵槸 RuntimeExecuting銆?
         *
         * SelfCheck 蹇呴』缁х画鍙備笌鏈€缁?Closure Gate銆?
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
         * WAL ResponsibilityEvent
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
                    "Wuwen Runtime"

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
                `Wuwen ResponsibilityEvent validation failed: ${JSON.stringify(
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
         * 姝ゆ椂浠嶄笉鑳藉亣璁?RuntimeClosed銆?
         * 鍏堣褰?RuntimeExecuting銆?
         * 鏈€缁?Closure Gate 閫氳繃鍚庡啀瑕嗙洊涓?RuntimeClosed銆?
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
         * Runtime 鍙湁鍚屾椂婊¤冻锛?
         *
         * 1. Registry 10/10
         * 2. Execution 10/10
         * 3. SelfCheck passed
         *
         * 鎵嶅厑璁稿啓鍏ワ細
         *
         *   RuntimeClosed
         *
         * 杩欐槸鏈€缁?Closure Gate銆?
         *
         * IMPORTANT:
         *
         * runtimeState 涓嶅啀浣滀负 Gate 鐨勮緭鍏ユ潯浠躲€?
         * 鍥犱负 RuntimeClosed 鏄?Gate 鐨勮緭鍑轰簨瀹烇紝
         * 涓嶈兘瑕佹眰鈥滃凡缁?Closed鈥濇墠鑳借瘉鏄庘€滃彲浠?Closed鈥濄€?
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
                `Wuwen Runtime closure failed: ${JSON.stringify(
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
         * Closure Gate 蹇呴』鍏堥€氳繃銆?
         *
         * 鍙湁鍦ㄤ互涓嬫潯浠跺叏閮ㄦ垚绔嬪悗锛?
         *
         *   Registry 瀹屾暣
         *   Execution 鍏ㄩ儴瀹屾垚
         *   Execution Pending = 0
         *   SelfCheck = passed
         *
         * 鎵嶅厑璁稿啓鍏ワ細
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
         * 杩欓噷楠岃瘉鈥滄槸鍚﹀叿澶囧叧闂祫鏍尖€濄€?
         *
         * 姝ゆ椂 RuntimeState 浠嶇劧涓嶈兘浣滀负鍒ゆ柇鏉′欢锛?
         * 鍥犱负 RuntimeClosed 灏氭湭鍐欏叆銆?
         *
         * 鍏堟楠岋紝鍐嶅啓鍏ャ€?
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
                `Wuwen Runtime closure invariant failed: ${JSON.stringify(
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
         * Closure Gate 宸茬粡閫氳繃銆?
         *
         * 鎵嶆寮忓啓鍏?RuntimeClosed銆?
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

        return this.sanitizeOutput(runtimeResult);
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

            RuntimeVerificationEngine:
                "runtimeVerification",

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

    sanitizeOutput(obj) {
        if (obj === null || obj === undefined) return obj;

        try {

            const purify = function(item, ancestors = []) {

                if (
                    item === null ||
                    item === undefined ||
                    typeof item !== "object"
                ) {
                    return item;
                }

                if (ancestors.indexOf(item) !== -1) {
                    return "[Circular]";
                }

                const nextAncestors =
                    ancestors.concat([item]);

                if (Array.isArray(item)) {
                    return item.map(
                        value =>
                            purify(
                                value,
                                nextAncestors
                            )
                    );
                }

                const result = {};

                const forbidden = [
                    "engineRegistry",
                    "runtimeContext",
                    "languageAdapter",
                    "registry",
                    "engine",
                    "engines"
                ];

                const keys = Object.keys(item);

                for (let i = 0; i < keys.length; i++) {

                    const key = keys[i];

                    if (
                        forbidden.indexOf(key) !== -1
                    ) {
                        continue;
                    }

                    try {
                        result[key] =
                            purify(
                                item[key],
                                nextAncestors
                            );
                    } catch (e) {}
                }

                return result;
            };

            const cleaned =
                purify(obj);

            const jsonStr =
                JSON.stringify(cleaned);

            const sanitizedJson =
                jsonStr
                    .replace(
                        /"[^"]*engineRegistry[^"]*"s*:s*(?:{[^}]*}|[[^]]*]|"[^"]*"|d+|true|false|null)/g,
                        '""'
                    )
                    .replace(
                        /"engineRegistry"/g,
                        '"sanitized_key"'
                    );

            return JSON.parse(
                sanitizedJson
            );

        } catch (e) {
            return {};
        }
    }


}

export default HonestRuntime;
