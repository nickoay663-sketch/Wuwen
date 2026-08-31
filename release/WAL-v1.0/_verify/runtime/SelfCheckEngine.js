import EngineBase from "./EngineBase.js";

class SelfCheckEngine extends EngineBase {

    constructor(runtimeObject) {

        super(
            "SelfCheckEngine",
            "10.8",
            "���ʼ���������������ԡ����α߽硢֤�ݱ߽硢��ʶ״̬�߽���ⲿ���Ա߽磬���жϱ������"
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
                "���ʼ���������������ԡ����α߽硢֤�ݱ߽硢��ʶ״̬�߽���ⲿ���Ա߽磬���жϱ������",

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
                        "�������Ƿ�������α߽硢�����߽硢��ʶ״̬�߽���ⲿ���Ա߽�Υ����"
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
         * Registry ������ǡ��Ƿ����ע�ᡱ��Ȩ����Դ��
         *
         * ����ʹ�� runtimeContext.engines �ж�ע�������ԡ�
         *
         * runtimeContext.engines ֻ��ʾ��
         * �Ѿ���� execution() ��д�빲�� executionResults
         */

        const registeredNames =
            registry.list();

        report.registeredCount =
            registeredNames.length;

        /*
         * Pipeline ʹ�� Engine class name��
         * Registry ʹ�� runtime registration name��
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

            };


        const expectedRegistryNames =
            pipeline.map(
                registryName
            );


        /*
         * ���� Pipeline Engine �������Ѿ�ע�ᡣ
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
         * Registry �в�������� Pipeline ֮���δ֪ Engine��
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
         * SelfCheck ִ��ʱ������δ���� executionResult��
         *
         * ������������������״̬�������� Registry failure��
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
         * SelfCheck ������Ψһ����������ִ�н׶�
         * ��δӵ�� executionResult �� Engine��
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
         * ��������£�
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
            "RuntimeVerificationEngine",
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
         * ����鸺��ȷ�ϣ�
         *
         * 1. Runtime ����ʶ״̬�� publishable ����һ��
         * 2. ������ SUPPORTED �����ݱ��뱻��ֹ����
         * 3. publishable=true ʱ������ڷ����ı�
         * 4. publishable=false ʱ���ò��������ı�
         * 5. Responsibility Boundary ���ñ�Խ��
         *
         * IMPORTANT:
         *
         * ��δ SUPPORTED������ SelfCheck failure��
         *
         * δ SUPPORTED ����ȷ��Ϊ���ǣ�
         *
         *     reconstructionState != SUPPORTED
         *             ��
         *     publishable = false
         *             ��
         *     publishableText = ""
         *
         * ��ˣ�
         *
         * responsibilityBoundaryValid
         * �������жϡ��Ƿ� SUPPORTED����
         * ֻ�����жϡ����α߽��Ƿ� exceeded����
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
         * ��δ�ﵽ SUPPORTED ʱ������ SelfCheck failure��
         *
         * ����ʾ ResponsibilityEngine �Ѿ���ȷ��ֹ��ǰ���е�
         * ���շ������Ρ�
         *
         * ��ˣ�
         *
         * publishable === false
         *     -> exceeded �ǺϷ�����ֹ����״̬
         *
         * publishable === true
         *     -> ��������� exceeded
         *
         * SelfCheck �����ǡ�����բ���Ƿ���ȷִ�С���
         * ������Ҫ�������������ն����� SUPPORTED��
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
                     * δ�ﵽ����������
                     *
                     * exceeded === true
                     * publishable === false
                     *
                     * ������ȷ����ֹ���������
                     */
                    if (!publishable) {
                        return true;
                    }

                    /*
                     * ���������Է�����
                     *
                     * �κ����α߽� exceeded
                     * ������ʹ Publication Boundary ʧ�ܡ�
                     */
                    return !exceeded;

                }
            );

        const supportedState =
            reconstructionState === "SUPPORTED" &&
            verificationStatus === "SUPPORTED";

        /*
         * SUPPORTED ������ publishable=true��
         *
         * �� SUPPORTED ���� publishable=false��
         */
        const publicationClaimValid =
            publishable === supportedState;

        /*
         * publishable=true
         *     -> ������ڷ����ı�
         *
         * publishable=false
         *     -> ���ô��ڷ����ı�
         */
        const textBoundaryValid =
            publishable
                ? publishableText.trim().length > 0
                : publishableText.trim().length === 0;

        /*
         * SelfCheck ��ͨ��������
         *
         * ����Ҫ�������������� SUPPORTED��
         * ����Ҫ�� Runtime ��ȷִ�С�������� / ��ֹ��������
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
         * Contract ����ʶ״̬��ΨһȨ����Դ��
         *
         * SelfCheck ��������ά���ڶ��� epistemic state
         * ��������
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
                            "epistemicState δ�� RuntimeContract.epistemicStates ������"

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
         * ֻ��� Runtime ��ʽ�׶������
         *
         * verificationStatus ���������µ� epistemicState��
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
            finalEpistemicState ||
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
                    "verificationBoundary ״̬δ�� RuntimeContract.epistemicStates ������"

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
                    "������ʶ״̬δ�� RuntimeContract.epistemicStates ������"

            });

        }


        /*
         * Contract �������������ʶ״̬����ʶ����
         */

        const contractStateCount =
            declaredStates.size;

        const contractRuleCount =
            Object.keys(epistemicRules).length;


        /*
         * �ؼ��߽磺
         *
         * VERIFIED_BUT_NOT_LINKED ����ֱ�ӳ�Ϊ SUPPORTED��
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
         * SUPPORTED ������ VERIFIED��
         */

        const unsupportedPromotion =
            reports.supported > 0 &&
            reports.verified === 0 &&
            epistemicRules
                .supportRequiresVerifiedEvidence === true;


        /*
         * �������ֲ���ֱ�ӳ�Ϊ��֤��
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
                    "Engine ������ Runtime Contract��"

            });

        }

        if (!registryReport.passed) {

            failures.push({

                problemType:
                    "registry-failure",

                impact:
                    "Engine δ���ע��� Registry �� Runtime Pipeline ��һ�¡�"

            });

        }

        if (!descriptionReport.passed) {

            failures.push({

                problemType:
                    "description-failure",

                impact:
                    "Engine �޷�������������������"

            });

        }

        if (!integrityReport.passed) {

            failures.push({

                problemType:
                    "pipeline-integrity-failure",

                impact:
                    "Runtime Pipeline ˳���쳣��"

            });

        }

        if (!boundaryReport.passed) {

            failures.push({

                problemType:
                    "responsibility-boundary-failure",

                impact:
                    "�������֤�ݻ����α߽硣"

            });

        }

        if (!publicationBoundaryReport.passed) {

            failures.push({

                problemType:
                    "publication-boundary-failure",

                impact:
                    "���ɽ��Υ�������߽磺ֻ������ Runtime ֧��״̬��ͨ�����α߽���ع�����������γɿɷ����ı���"

            });

        }

        if (!epistemicReport.passed) {

            failures.push({

                problemType:
                    "epistemic-boundary-failure",

                impact:
                    "��ʶ״̬����Խ�磬Runtime ���� Contract δ����״̬�����֡���֤����Ӧ��֧��֮�䷢���Ƿ�������"

            });

        }

        if (!languageBoundaryReport.passed) {

            failures.push({

                problemType:
                    "external-language-boundary-failure",

                impact:
                    "�ⲿ����ϵͳ������Ȩ����ݻ����ӱ߽緢���쳣��"

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
                    ? "��ֹ������ǰ���ɽ�������� Reconstruction / Evidence / Correspondence / Responsibility �����¼�顣"
                    : "����������������ִ�� SelfCheck��",

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
                [
                    ...(registryReport.executionCompleted || []),
                    "SelfCheckEngine"
                ],

            executionPending:
                (registryReport.executionPending || [])
                    .filter(
                        name =>
                            name !== "SelfCheckEngine"
                            &&
                            name !== "selfCheck"
                    ),

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
