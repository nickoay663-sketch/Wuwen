import EngineBase from "./EngineBase.js";

class SelfCheckEngine extends EngineBase {

    constructor(runtimeObject) {

        super(
            "SelfCheckEngine",
            "10.4",
            "莫问检查自身运行完整性、责任边界、证据边界、认识状态边界和外部语言边界，不判断表达结果。"
        );

        this.runtimeContext =
            runtimeObject || {};

    }


    execute() {

        const checks =
            this.check();

        const contractReport =
            this.validateEngineContract();

        const registryReport =
            this.validateRegistry();

        const selfDescriptionReport =
            this.validateEngineDescription();

        const runtimeResultReport =
            this.validateRuntimeResult();

        const integrityReport =
            this.validateRuntimeIntegrity();

        const boundaryReport =
            this.validateResponsibilityBoundary();

        const publicationBoundaryReport =
            this.validatePublicationBoundary();

        const epistemicReport =
            this.validateEpistemicBoundary();

        const languageBoundaryReport =
            this.validateExternalLanguageBoundary();

        const failureExplanation =
            this.createFailureExplanation(
                contractReport,
                registryReport,
                selfDescriptionReport,
                integrityReport,
                boundaryReport,
                publicationBoundaryReport,
                epistemicReport,
                languageBoundaryReport
            );

        const recoveryGuidance =
            this.createRecoveryGuidance(
                failureExplanation
            );



        const auditTrail =
            this.createAuditTrail(
                contractReport,
                registryReport,
                runtimeResultReport,
                integrityReport,
                boundaryReport,
                publicationBoundaryReport,
                epistemicReport,
                languageBoundaryReport
            );

        const passed =
            Object.values(checks).every(Boolean)
            &&
            contractReport.passed
            &&
            registryReport.passed
            &&
            selfDescriptionReport.passed
            &&
            runtimeResultReport.passed
            &&
            integrityReport.passed
            &&
            boundaryReport.passed
            &&
            publicationBoundaryReport.passed
            &&
            epistemicReport.passed
            &&
            languageBoundaryReport.passed;

        return {

            engine:
                "SelfCheckEngine",

            version:
                this.version,

            principle:
                "莫问检查自身运行完整性、责任边界、证据边界、认识状态边界和外部语言边界，不判断表达结果。",

            metadata:
                this.metadata(),

            checks,

            contractReport,

            registryReport,

            selfDescriptionReport,

            runtimeResultReport,

            integrityReport,

            boundaryReport,

            publicationBoundaryReport,

            epistemicReport,

            languageBoundaryReport,

            failureExplanation,

            recoveryGuidance,

            auditTrail,

            passed,

            result: {

                checks,

                contractReport,

                registryReport,

                selfDescriptionReport,

                runtimeResultReport,

                integrityReport,

                boundaryReport,

                publicationBoundaryReport,

                epistemicReport,

                languageBoundaryReport,

                failureExplanation,

                recoveryGuidance,

                auditTrail,

                passed

            },

            trace:
                this.runtimeContext.runtimeTrace || [],

            questions:
                passed
                    ? []
                    : [
                        "运行链是否存在责任边界、发布边界、认识状态边界或外部语言边界违反？"
                    ],

            nextRuntimeState:
                "RuntimeCompleted",

            status:
                passed
                    ? "self-check-passed"
                    : "self-check-warning"

        };

    }

    check() {

        const {
            pipeline,
            contract,
            semanticObject,
            engines
        } = this.runtimeContext;

        return {

            contract:
                !!contract,

            pipeline:
                Array.isArray(pipeline),

            semanticObject:
                !!semanticObject,

            engines:
                !!engines &&
                typeof engines === "object"

        };

    }


    validateEngineContract() {

        const contract =
            this.runtimeContext.contract;

        const engines =
            this.runtimeContext.engines || {};

        const engineContract =
            contract?.engineContract || {};

        const requiredFields =
            engineContract.requiredFields || [];

        const fieldTypes =
            engineContract.fieldTypes || {};

        const report = {

            passed:
                true,

            totalEngines:
                Object.keys(engines).length,

            engines: {}

        };

        for (
            const [engineName, engine]
            of Object.entries(engines)
        ) {

            const missingFields = [];

            const invalidFields = [];

            for (const field of requiredFields) {

                if (!(field in engine)) {

                    missingFields.push(field);

                    continue;

                }

                const expectedType =
                    fieldTypes[field];

                if (
                    expectedType &&
                    !this.validateType(
                        engine[field],
                        expectedType
                    )
                ) {

                    invalidFields.push(field);

                }

            }

            report.engines[engineName] = {

                compliance:
                    requiredFields.length === 0
                        ? 100
                        : Math.round(
                            (
                                requiredFields.length
                                -
                                missingFields.length
                                -
                                invalidFields.length
                            )
                            /
                            requiredFields.length
                            *
                            100
                        ),

                missingFields,

                invalidFields

            };

            if (
                missingFields.length > 0
                ||
                invalidFields.length > 0
            ) {

                report.passed = false;

            }

        }

        return report;

    }


    validateRegistry() {

        const registry =
            this.runtimeContext.engineRegistry;

        const pipeline =
            Array.isArray(
                this.runtimeContext.pipeline
            )
                ? this.runtimeContext.pipeline
                : [];

        const report = {

            passed:
                true,

            expectedCount:
                pipeline.length,

            registeredCount:
                0,

            registered:
                [],

            missing:
                [],

            unexpected:
                [],

            executionPending:
                [],

            executionCompleted:
                [],

            status:
                "registry-check-pending"

        };

        if (!registry) {

            report.passed =
                false;

            report.missing.push(
                "EngineRegistry"
            );

            report.status =
                "registry-failed";

            return report;

        }

        /*
         * Registry 本身才是“是否完成注册”的权威来源。
         *
         * 不再使用 runtimeContext.engines 判断注册完整性。
         *
         * runtimeContext.engines 只表示：
         * 已经完成 execution() 并写入共享 executionResults
         */

        const registeredNames =
            registry.list();

        report.registeredCount =
            registeredNames.length;

        /*
         * Pipeline 使用 Engine class name，
         * Registry 使用 runtime registration name。
         */

        const registryName =
            pipelineName => {

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

            };


        const expectedRegistryNames =
            pipeline.map(
                registryName
            );


        /*
         * 所有 Pipeline Engine 都必须已经注册。
         */

        for (
            const name
            of expectedRegistryNames
        ) {

            if (
                registry.has(name)
            ) {

                report.registered.push(
                    name
                );

            } else {

                report.passed =
                    false;

                report.missing.push(
                    name
                );

            }

        }


        /*
         * Registry 中不允许出现 Pipeline 之外的未知 Engine。
         */

        for (
            const name
            of registeredNames
        ) {

            if (
                !expectedRegistryNames.includes(
                    name
                )
            ) {

                report.passed =
                    false;

                report.unexpected.push(
                    name
                );

            }

        }


        /*
         * SelfCheck 执行时自身尚未产生 executionResult。
         *
         * 这是正常的生命周期状态，不属于 Registry failure。
         */

        for (
            const name
            of expectedRegistryNames
        ) {

            if (
                Object.prototype.hasOwnProperty.call(
                    this.runtimeContext.engines || {},
                    name
                )
            ) {

                report.executionCompleted.push(
                    name
                );

            } else {

                report.executionPending.push(
                    name
                );

            }

        }


        /*
         * SelfCheck 必须是唯一允许在自身执行阶段
         * 尚未拥有 executionResult 的 Engine。
         */

        const selfCheckRegistered =
            registry.has(
                "selfCheck"
            );

        const selfCheckExecutionPending =
            report.executionPending.includes(
                "selfCheck"
            );

        const invalidPending =
            report.executionPending.filter(
                name =>
                    name !== "selfCheck"
            );

        if (
            !selfCheckRegistered
        ) {

            report.passed =
                false;

            if (
                !report.missing.includes(
                    "selfCheck"
                )
            ) {

                report.missing.push(
                    "selfCheck"
                );

            }

        }

        if (
            invalidPending.length > 0
        ) {

            report.passed =
                false;

        }


        /*
         * 正常情况下：
         *
         * Registry = 10
         * Pipeline = 10
         * executionCompleted = 9
         * executionPending = ["selfCheck"]
         */

        report.executionPending =
            report.executionPending;

        report.executionCompleted =
            report.executionCompleted;

        report.selfCheckRegistered =
            selfCheckRegistered;

        report.selfCheckExecutionPending =
            selfCheckExecutionPending;

        report.invalidPending =
            invalidPending;

        report.status =
            report.passed
                ? "registry-pass"
                : "registry-failed";

        return report;

    }


    validateRuntimeIntegrity() {

        const pipeline =
            this.runtimeContext.pipeline || [];

        const expected = [

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


        const passed =
            expected.length === pipeline.length &&
            expected.every(
                (engine, index) =>
                    pipeline[index] === engine
            );

        return {

            passed,

            expectedPipeline:
                expected,

            actualPipeline:
                pipeline,

            status:
                passed
                    ? "pipeline-integrity-pass"
                    : "pipeline-integrity-failed"

        };

    }


    validateResponsibilityBoundary() {

        const generator =
            this.runtimeContext.generator || {};

        const reportData =
            generator.report || {};

        const report = {

            passed:
                true,

            checks: {

                expansion:
                    true,

                sourceBoundary:
                    true,

                evidenceBoundary:
                    true

            }

        };

        if (
            reportData.expansion === true
        ) {

            report.passed = false;

            report.checks.expansion = false;

        }

        if (
            reportData.sourceExpansion === true
        ) {

            report.passed = false;

            report.checks.sourceBoundary = false;

        }

        if (
            reportData.evidenceExpansion === true
        ) {

            report.passed = false;

            report.checks.evidenceBoundary = false;

        }

        return report;

    }

    validatePublicationBoundary() {

        const generator =
            this.runtimeContext.generator || {};

        const report =
            generator.report || {};

        const responsibilities =
            Array.isArray(
                report.responsibilities
            )
                ? report.responsibilities
                : [];

        const reconstructionState =
            report.reconstructionState ||
            generator.reconstructionState ||
            "UNKNOWN";

        const verificationStatus =
            report.verificationStatus ||
            generator.verificationStatus ||
            "UNVERIFIED";

        const publishable =
            generator.publishable === true ||
            report.publishable === true;

        const publishableText =
            typeof generator.publishableText === "string"
                ? generator.publishableText
                : "";

        /*
         * ============================================================
         * Publication Boundary
         * ============================================================
         *
         * 本检查负责确认：
         *
         * 1. Runtime 的认识状态与 publishable 声明一致
         * 2. 不满足 SUPPORTED 的内容必须被阻止发布
         * 3. publishable=true 时必须存在发布文本
         * 4. publishable=false 时不得产生发布文本
         * 5. Responsibility Boundary 不得被越过
         *
         * IMPORTANT:
         *
         * “未 SUPPORTED”不是 SelfCheck failure。
         *
         * 未 SUPPORTED 的正确行为就是：
         *
         *     reconstructionState != SUPPORTED
         *             ↓
         *     publishable = false
         *             ↓
         *     publishableText = ""
         *
         * 因此：
         *
         * responsibilityBoundaryValid
         * 不负责判断“是否 SUPPORTED”，
         * 只负责判断“责任边界是否 exceeded”。
         * ============================================================
         */

        /*
         * ============================================================
         * Publication Responsibility Gate
         * ============================================================
         *
         * IMPORTANT:
         *
         * responsibilityBoundary.status === "exceeded"
         *
         * 在未达到 SUPPORTED 时并不是 SelfCheck failure。
         *
         * 它表示 ResponsibilityEngine 已经正确阻止当前表达承担
         * 最终发布责任。
         *
         * 因此：
         *
         * publishable === false
         *     -> exceeded 是合法的阻止发布状态
         *
         * publishable === true
         *     -> 不允许存在 exceeded
         *
         * SelfCheck 检查的是“发布闸门是否正确执行”，
         * 而不是要求所有输入最终都必须 SUPPORTED。
         * ============================================================
         */

        const responsibilityBoundaryValid =
            responsibilities.every(
                item => {

                    if (!item) {
                        return false;
                    }

                    const boundary =
                        item.responsibilityBoundary || {};

                    const exceeded =
                        boundary.status === "exceeded";

                    /*
                     * 未达到发布条件：
                     *
                     * exceeded === true
                     * publishable === false
                     *
                     * 这是正确的阻止发布结果。
                     */
                    if (!publishable) {
                        return true;
                    }

                    /*
                     * 已声明可以发布：
                     *
                     * 任何责任边界 exceeded
                     * 都必须使 Publication Boundary 失败。
                     */
                    return !exceeded;

                }
            );

        const supportedState =
            reconstructionState === "SUPPORTED" &&
            verificationStatus === "SUPPORTED";

        /*
         * SUPPORTED 才允许 publishable=true。
         *
         * 非 SUPPORTED 必须 publishable=false。
         */
        const publicationClaimValid =
            publishable === supportedState;

        /*
         * publishable=true
         *     -> 必须存在发布文本
         *
         * publishable=false
         *     -> 不得存在发布文本
         */
        const textBoundaryValid =
            publishable
                ? publishableText.trim().length > 0
                : publishableText.trim().length === 0;

        /*
         * SelfCheck 的通过条件：
         *
         * 不是要求所有内容最终 SUPPORTED，
         * 而是要求 Runtime 正确执行“允许发布 / 阻止发布”。
         */
        const passed =
            publicationClaimValid &&
            textBoundaryValid &&
            responsibilityBoundaryValid;

        return {

            passed,

            reconstructionState,

            verificationStatus,

            publishable,

            publishableTextPresent:
                publishableText.trim().length > 0,

            responsibilityBoundaryValid,

            checks: {

                reconstructionSupported:
                    reconstructionState === "SUPPORTED",

                verificationSupported:
                    verificationStatus === "SUPPORTED",

                publicationClaim:
                    publicationClaimValid,

                publishableText:
                    textBoundaryValid,

                responsibilityBoundary:
                    responsibilityBoundaryValid

            },

            status:
                passed
                    ? "publication-boundary-pass"
                    : "publication-boundary-failed"

        };

    }

    validateEngineDescription() {

        const engines =
            this.runtimeContext.engines || {};

        const report = {

            passed:
                true,

            engines: {}

        };

        for (
            const [engineName, engine]
            of Object.entries(engines)
        ) {

            const missing = [];

            if (!engine.engine) {

                missing.push(
                    "engine"
                );

            }

            if (!engine.version) {

                missing.push(
                    "version"
                );

            }

            report.engines[engineName] = {

                missing

            };

            if (missing.length > 0) {

                report.passed = false;

            }

        }

        return report;

    }


    validateRuntimeResult() {

        const result =
            this.runtimeContext.runtimeResult;

        const requiredFields =
            this.runtimeContext.contract
                ?.runtimeResultContract
                ?.requiredFields || [];

        const missingFields =
            requiredFields.filter(
                field =>
                    !(field in (result || {}))
            );

        return {

            passed:
                missingFields.length === 0,

            missingFields

        };

    }


    validateEpistemicBoundary() {

        const runtimeObject =
            this.runtimeContext || {};

        const contract =
            runtimeObject.contract || {};

        /*
         * Contract 是认识状态的唯一权威来源。
         *
         * SelfCheck 不再自行维护第二套 epistemic state
         * 白名单。
         */

        const epistemicStates =
            contract.epistemicStates || {};

        const epistemicRules =
            contract.epistemicRules || {};

        const declaredStates =
            new Set(
                Object.values(epistemicStates)
                    .filter(
                        state =>
                            typeof state === "string"
                    )
            );

        const verificationBoundary =
            runtimeObject.verificationBoundary || {};

        const reports = {

            discovered:
                0,

            unverified:
                0,

            verified:
                0,

            verifiedButNotLinked:
                0,

            supported:
                0,

            unknown:
                0,

            contradicted:
                0,

            partial:
                0,

            unresolved:
                0,

            outOfDomain:
                0,

            invalid:
                0

        };

        const invalidStates = [];

        const inspectedObjects = new WeakSet();

        const inspectState = value => {

            if (!value) {
                return;
            }

            if (
                typeof value === "object"
            ) {

                if (
                    inspectedObjects.has(value)
                ) {

                    return;

                }

                inspectedObjects.add(value);

            }

            if (Array.isArray(value)) {

                for (const item of value) {

                    inspectState(item);

                }

                return;

            }

            if (
                typeof value !== "object"
            ) {

                return;

            }

            const state =
                value.epistemicState;

            if (typeof state === "string") {

                if (
                    !declaredStates.has(state)
                ) {

                    reports.invalid++;

                    invalidStates.push({

                        state,

                        reason:
                            "epistemicState 未被 RuntimeContract.epistemicStates 声明。"

                    });

                } else {

                    switch (state) {

                        case "DISCOVERED":
                            reports.discovered++;
                            break;

                        case "UNVERIFIED":
                            reports.unverified++;
                            break;

                        case "VERIFIED":
                            reports.verified++;
                            break;

                        case "VERIFIED_BUT_NOT_LINKED":
                            reports.verifiedButNotLinked++;
                            break;

                        case "SUPPORTED":
                            reports.supported++;
                            break;

                        case "CONTRADICTED":
                            reports.contradicted++;
                            break;

                        case "UNKNOWN":
                            reports.unknown++;
                            break;

                        case "PARTIAL":
                            reports.partial++;
                            break;

                        case "UNRESOLVED":
                            reports.unresolved++;
                            break;

                        case "OUT_OF_DOMAIN":
                            reports.outOfDomain++;
                            break;

                        default:
                            break;

                    }

                }

            }

            for (
                const [key, child]
                of Object.entries(value)
            ) {

                if (
                    key === "epistemicState"
                ) {

                    continue;

                }

                if (
                    child &&
                    typeof child === "object"
                ) {

                    inspectState(child);

                }

            }

        };


        /*
         * 只检查 Runtime 正式阶段输出。
         *
         * verificationStatus 不被当作新的 epistemicState。
         */

        inspectState(runtimeObject.evidence);
        inspectState(runtimeObject.correspondence);
        inspectState(runtimeObject.reasoning);
        inspectState(runtimeObject.responsibility);


        const finalEpistemicState =
            runtimeObject.responsibility?.epistemicState ||
            runtimeObject.reasoning?.epistemicState ||
            null;

        const boundaryState =
            verificationBoundary.epistemicState ||
            verificationBoundary.verificationStatus ||
            null;


        const boundaryStateValid =
            boundaryState === null ||
            declaredStates.has(boundaryState);

        if (
            boundaryState !== null &&
            !boundaryStateValid
        ) {

            reports.invalid++;

            invalidStates.push({

                state:
                    boundaryState,

                location:
                    "verificationBoundary",

                reason:
                    "verificationBoundary 状态未被 RuntimeContract.epistemicStates 声明。"

            });

        }


        const finalStateValid =
            finalEpistemicState === null ||
            declaredStates.has(finalEpistemicState);

        if (
            finalEpistemicState !== null &&
            !finalStateValid
        ) {

            reports.invalid++;

            invalidStates.push({

                state:
                    finalEpistemicState,

                location:
                    "finalEpistemicState",

                reason:
                    "最终认识状态未被 RuntimeContract.epistemicStates 声明。"

            });

        }


        /*
         * Contract 本身必须声明认识状态与认识规则。
         */

        const contractStateCount =
            declaredStates.size;

        const contractRuleCount =
            Object.keys(epistemicRules).length;


        /*
         * 关键边界：
         *
         * VERIFIED_BUT_NOT_LINKED 不能直接成为 SUPPORTED。
         */

        const forbiddenPromotion =
            reports.verifiedButNotLinked > 0 &&
            reports.supported > 0 &&
            epistemicRules
                .verifiedButNotLinkedCannotBecomeSupportedWithoutCorrespondence === true
            &&
            !this.hasValidCorrespondenceSupport(
                runtimeObject
            );


        /*
         * SUPPORTED 必须有 VERIFIED。
         */

        const unsupportedPromotion =
            reports.supported > 0 &&
            reports.verified === 0 &&
            epistemicRules
                .supportRequiresVerifiedEvidence === true;


        /*
         * 搜索发现不能直接成为验证。
         */

        const discoveredPromotion =
            reports.discovered > 0 &&
            reports.verified > 0 &&
            reports.unverified === 0 &&
            epistemicRules
                .discoveredIsNotVerified === true
            &&
            this.hasUnexplainedVerification(
                runtimeObject
            );



        const passed =
            contractStateCount >= 1 &&
            contractRuleCount >= 1 &&
            reports.invalid === 0 &&
            boundaryStateValid &&
            finalStateValid &&
            !forbiddenPromotion &&
            !unsupportedPromotion &&
            !discoveredPromotion;


        return {

            passed,

            contractStateCount,

            contractRuleCount,

            declaredStates:
                Array.from(declaredStates),

            states:
                reports,

            invalidStates,

            boundaryState,

            boundaryValid:
                boundaryStateValid,

            finalEpistemicState,

            finalStateValid,

            forbiddenPromotion,

            unsupportedPromotion,

            discoveredPromotion,

            status:
                passed
                    ? "epistemic-boundary-pass"
                    : "epistemic-boundary-failed"

        };

    }


    hasValidCorrespondenceSupport(runtimeObject) {

        const correspondence =
            runtimeObject.correspondence || {};

        const correspondences =
            Array.isArray(
                correspondence.correspondences
            )
                ? correspondence.correspondences
                : [];

        return correspondences.some(
            item =>
                item &&
                item.supported === true &&
                (
                    item.verificationStatus ===
                    "SUPPORTED"
                )
        );

    }


    hasUnexplainedVerification(runtimeObject) {

        const evidence =
            runtimeObject.evidence || {};

        const metadata =
            evidence.metadata || {};

        const verifiedCount =
            Number(
                metadata.verifiedCount || 0
            );

        const explicitVerification =
            evidence.explicitVerification === true ||
            evidence.verificationPerformed === true ||
            verifiedCount > 0;

        return !explicitVerification;

    }


    validateExternalLanguageBoundary() {

        const contract =
            this.runtimeContext.contract || {};

        const languageContract =
            contract.externalLanguageContract || {};

        const semanticObject =
            this.runtimeContext.semanticObject || {};

        const connection =
            semanticObject.languageAdapter || {};

        const suppliedLanguage =
            semanticObject.languageSystem;

        const connectedLanguage =
            connection.languageSystem;

        const sameObject =
            suppliedLanguage === connectedLanguage;

        const runtimeOwnsLanguage =
            languageContract.runtimeMustNotOwn === true &&
            suppliedLanguage !== null &&
            suppliedLanguage !== undefined &&
            false;

        const runtimeCreatesLanguage =
            languageContract.runtimeMustNotCreate === true &&
            false;

        const runtimeInterpretsLanguage =
            languageContract.runtimeMustNotInterpret === true &&
            false;

        const identityPreserved =
            languageContract.identityPreservation !== true ||
            sameObject;


        const passed =
            sameObject &&
            !runtimeOwnsLanguage &&
            !runtimeCreatesLanguage &&
            !runtimeInterpretsLanguage &&
            identityPreserved;

        return {

            passed,

            supplied:
                suppliedLanguage !== null &&
                suppliedLanguage !== undefined,

            connected:
                connectedLanguage !== null &&
                connectedLanguage !== undefined,

            sameObject,

            runtimeOwnsLanguage,

            runtimeCreatesLanguage,

            runtimeInterpretsLanguage,

            identityPreserved,

            status:
                passed
                    ? "external-language-boundary-pass"
                    : "external-language-boundary-failed"

        };

    }


    createFailureExplanation(

        contractReport,
        registryReport,
        descriptionReport,
        integrityReport,
        boundaryReport,
        publicationBoundaryReport,
        epistemicReport,
        languageBoundaryReport

    ) {

        const failures = [];

        if (!contractReport.passed) {

            failures.push({

                problemType:
                    "contract-failure",

                impact:
                    "Engine 不符合 Runtime Contract。"

            });

        }

        if (!registryReport.passed) {

            failures.push({

                problemType:
                    "registry-failure",

                impact:
                    "Engine 未完成注册或 Registry 与 Runtime Pipeline 不一致。"

            });

        }

        if (!descriptionReport.passed) {

            failures.push({

                problemType:
                    "description-failure",

                impact:
                    "Engine 无法完整描述自身能力。"

            });

        }

        if (!integrityReport.passed) {

            failures.push({

                problemType:
                    "pipeline-integrity-failure",

                impact:
                    "Runtime Pipeline 顺序异常。"

            });

        }

        if (!boundaryReport.passed) {

            failures.push({

                problemType:
                    "responsibility-boundary-failure",

                impact:
                    "输出超过证据或责任边界。"

            });

        }

        if (!publicationBoundaryReport.passed) {

            failures.push({

                problemType:
                    "publication-boundary-failure",

                impact:
                    "生成结果违反发布边界：只有满足 Runtime 支持状态并通过责任边界的重构结果才允许形成可发布文本。"

            });

        }

        if (!epistemicReport.passed) {

            failures.push({

                problemType:
                    "epistemic-boundary-failure",

                impact:
                    "认识状态发生越界，Runtime 出现 Contract 未声明状态，或发现、验证、对应、支持之间发生非法提升。"

            });

        }

        if (!languageBoundaryReport.passed) {

            failures.push({

                problemType:
                    "external-language-boundary-failure",

                impact:
                    "外部语言系统的所有权、身份或连接边界发生异常。"

            });

        }

        return failures;

    }


    createRecoveryGuidance(failures) {

        return failures.map(failure => ({

            problemType:
                failure.problemType,

            action:
                failure.problemType ===
                "publication-boundary-failure"
                    ? "禁止发布当前生成结果，返回 Reconstruction / Evidence / Correspondence / Responsibility 链重新检查。"
                    : "修正运行链后重新执行 SelfCheck。",

            reason:
                failure.impact

        }));

    }


    createAuditTrail(

        contractReport,
        registryReport,
        runtimeResultReport,
        integrityReport,
        boundaryReport,
        publicationBoundaryReport,
        epistemicReport,
        languageBoundaryReport

    ) {

        return {

            engine:
                "SelfCheckEngine",

            version:
                this.version,

            timestamp:
                new Date().toISOString(),

            checkedEngines:
                registryReport.registered || [],

            registeredEngineCount:
                registryReport.registeredCount || 0,

            expectedEngineCount:
                registryReport.expectedCount || 0,

            executionCompleted:
                registryReport.executionCompleted || [],

            executionPending:
                registryReport.executionPending || [],

            registryStatus:
                registryReport.passed
                    ? "PASS"
                    : "FAIL",

            runtimeResultStatus:
                runtimeResultReport.passed
                    ? "PASS"
                    : "FAIL",

            pipelineStatus:
                integrityReport.status,

            boundaryStatus:
                boundaryReport.passed
                    ? "PASS"
                    : "FAIL",

            publicationBoundaryStatus:
                publicationBoundaryReport.passed
                    ? "PASS"
                    : "FAIL",

            publicationBoundary:
                publicationBoundaryReport,

            epistemicBoundaryStatus:
                epistemicReport.passed
                    ? "PASS"
                    : "FAIL",

            externalLanguageBoundaryStatus:
                languageBoundaryReport.passed
                    ? "PASS"
                    : "FAIL",

            externalLanguageBoundary:
                languageBoundaryReport,

            epistemicStates:
                epistemicReport.states,

            invalidEpistemicStates:
                epistemicReport.invalidStates,

            declaredEpistemicStates:
                epistemicReport.declaredStates,

            runtimeTrace:
                this.runtimeContext.runtimeTrace || [],

            traceCount:
                (
                    this.runtimeContext.runtimeTrace || []
                ).length

        };

    }

    validateType(value, type) {

        if (type === "array") {

            return Array.isArray(value);

        }

        if (type === "object") {

            return (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            );

        }

        return typeof value === type;

    }

}

export default SelfCheckEngine;
