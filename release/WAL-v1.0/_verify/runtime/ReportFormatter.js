class ReportFormatter {

    constructor(runtimeResult) {

        this.runtimeResult =
            runtimeResult || {};

    }


    run() {

        const source =
            this.runtimeResult;

        const report =
            this.buildPublishableReport();

        return {

            version:
                "10.8",

            principle:
                "Wuwen只整理运行结果，不增加新的判断。",

            metadata: {

                generatedAt:
                    source.generatedAt ||
                    source.metadata?.generatedAt ||
                    null,

                runtimeVersion:
                    source.runtimeVersion ||
                    source.metadata?.runtimeVersion ||
                    null,

                contractVersion:
                    source.metadata?.contractVersion ||
                    null,

                engineCount:
                    source.metadata?.engineCount ||
                    0

            },

            report,

            status:
                source.selfCheck?.result?.passed === true
                    ? "report-generated"
                    : "report-warning",

            questions:
                source.selfCheck?.questions ||
                source.selfCheck?.result?.questions ||
                [],

            trace:
                this.buildTrace(
                    source.runtimeTrace
                )

        };

    }


    /*
     * =========================================================
     * WAL PUBLISH BOUNDARY
     * =========================================================
     *
     * Runtime 鍐呴儴瀵硅薄涓嶈兘鐩存帴杩涘叆鍙戝竷瀵硅薄銆?
     *
     * 鏈眰閲囩敤鈥滃瓧娈电櫧鍚嶅崟鎶曞奖鈥濓紝
     * 鑰屼笉鏄繁搴﹀鍒?Runtime 瀵硅薄銆?
     *
     * 鍥犳锛?
     *
     * Runtime Object Graph
     *        鈫?
     *   Publish Projection
     *        鈫?
     *    WAL Report
     *
     * 涓嶅厑璁革細
     *
     *   result 鈫?result 鈫?result
     *   runtimeContext
     *   engineRegistry
     *   engines
     *   semanticObject
     *   runtimeObject
     *
     * 杩涘叆鏈€缁堝彂甯冨璞°€?
     *
     * WAL 涓嶉噸鏂板垽鏂换浣?epistemic 鐘舵€併€?
     * =========================================================
     */

    buildPublishableReport() {

        const source =
            this.runtimeResult || {};

        return {

            runtimeVersion:
                source.runtimeVersion || null,

            epistemicState:
                source.epistemicState || null,

            epistemicBoundary:
                this.projectBoundary(
                    source.epistemicBoundary
                ),

            recognition:
                this.projectEngine(
                    source.recognition,
                    [
                        "engine",
                        "version",
                        "principle",
                        "status",
                        "metadata",
                        "questions",
                        "result"
                    ]
                ),

            definition:
                this.projectEngine(
                    source.definition,
                    [
                        "engine",
                        "version",
                        "principle",
                        "status",
                        "metadata",
                        "questions",
                        "result"
                    ]
                ),

            testimony:
                this.projectTestimony(
                    source.testimony
                ),

            testimonyValidation:
                this.projectEngine(
                    source.testimonyValidation,
                    [
                        "engine",
                        "version",
                        "status",
                        "metadata",
                        "questions"
                    ]
                ),

            search:
                this.projectEngine(
                    source.search,
                    [
                        "engine",
                        "version",
                        "principle",
                        "status",
                        "metadata",
                        "questions"
                    ]
                ),

            evidence:
                this.projectEvidence(
                    source.evidence
                ),

            correspondence:
                this.projectCorrespondence(
                    source.correspondence
                ),

            reasoning:
                this.projectReasoning(
                    source.reasoning
                ),

            responsibility:
                this.projectResponsibility(
                    source.responsibility
                ),

            responsibilityModel:
                this.safeClone(
                    source.responsibilityModel
                ),

            reconstruction:
                this.projectReconstruction(
                    source.reconstruction
                ),

            generator:
                this.projectGenerator(
                    source.generator
                ),

            selfCheck:
                this.projectSelfCheck(
                    source.selfCheck
                ),

            responsibilityEvent:
                this.projectResponsibilityEvent(
                    source.responsibilityEvent
                )

        };

    }


    /*
     * =========================================================
     * Generic Engine Projection
     * =========================================================
     */

    projectEngine(
        engineObject,
        fields = []
    ) {

        if (
            !engineObject ||
            typeof engineObject !== "object"
        ) {

            return null;

        }

        const output = {};

        for (
            const field of fields
        ) {

            if (
                engineObject[field] === undefined
            ) {

                continue;

            }

            if (
                field === "result"
            ) {

                output.result =
                    this.projectResult(
                        engineObject.result
                    );

                continue;

            }

            if (
                field === "metadata"
            ) {

                output.metadata =
                    this.projectMetadata(
                        engineObject.metadata
                    );

                continue;

            }

            output[field] =
                this.safeClone(
                    engineObject[field]
                );

        }

        return output;

    }


    /*
     * =========================================================
     * Result Projection
     * =========================================================
     *
     * result 鍙兘淇濈暀鈥滅粨璁烘€у瓧娈碘€濄€?
     *
     * 涓嶅厑璁告妸 result 鍐呴儴鐨勫ぇ鍨?Runtime 瀵硅薄缁х画澶嶅埗銆?
     * =========================================================
     */

    projectResult(result) {

        if (
            !result ||
            typeof result !== "object"
        ) {

            return null;

        }

        const output = {};

        const allowed =
            [
                "status",
                "supported",
                "epistemicState",
                "verificationStatus",
                "conclusionBoundary",
                "reasoningStrength",
                "reasoningType",
                "responsibilityBoundary",
                "evidenceState",
                "epistemicBoundary",
                "verificationBoundary",
                "responsibilities",
                "reasonings",
                "correspondences",
                "evidences",
                "evidenceChain",
                "sources",
                "sourceCount",
                "evidenceCount",
                "verifiedEvidenceCount",
                "supportedCount",
                "unverifiedCount",
                "unknownCount",
                "passed"
            ];

        for (
            const field of allowed
        ) {

            if (
                result[field] === undefined
            ) {

                continue;

            }

            if (
                field === "responsibilities"
            ) {

                output[field] =
                    this.projectResponsibilities(
                        result[field]
                    );

                continue;

            }

            if (
                field === "reasonings"
            ) {

                output[field] =
                    this.projectReasonings(
                        result[field]
                    );

                continue;

            }

            if (
                field === "correspondences"
            ) {

                output[field] =
                    this.projectCorrespondences(
                        result[field]
                    );

                continue;

            }

            if (
                field === "evidences"
            ) {

                output[field] =
                    this.projectEvidences(
                        result[field]
                    );

                continue;

            }

            output[field] =
                this.safeClone(
                    result[field]
                );

        }

        return output;

    }


    /*
     * =========================================================
     * Testimony
     * =========================================================
     */

    projectTestimony(testimony) {

        if (
            !testimony ||
            typeof testimony !== "object"
        ) {

            return null;

        }

        return {

            type:
                testimony.type || null,

            version:
                testimony.version || null,

            createdAt:
                testimony.createdAt || null,

            originalInput:
                testimony.originalInput || null,

            content:
                testimony.content || null,

            language:
                testimony.language ?? null,

            expressionType:
                testimony.expressionType ?? null,

            objects:
                this.safeClone(
                    testimony.objects || []
                ),

            concepts:
                this.safeClone(
                    testimony.concepts || []
                ),

            universalExpression:
                testimony.universalExpression ?? null

        };

    }


    /*
     * =========================================================
     * Evidence
     * =========================================================
     */

    projectEvidence(evidence) {

        if (
            !evidence ||
            typeof evidence !== "object"
        ) {

            return null;

        }

        return {

            engine:
                evidence.engine || null,

            version:
                evidence.version || null,

            principle:
                evidence.principle || null,

            status:
                evidence.status || null,

            metadata:
                this.projectMetadata(
                    evidence.metadata
                ),

            evidences:
                this.projectEvidences(
                    evidence.evidences
                ),

            questions:
                this.safeClone(
                    evidence.questions || []
                )

        };

    }


    projectEvidences(evidences) {

        if (
            !Array.isArray(evidences)
        ) {

            return [];

        }

        return evidences.map(
            evidence => {

                if (
                    !evidence ||
                    typeof evidence !== "object"
                ) {

                    return evidence;

                }

                return {

                    type:
                        evidence.type || null,

                    source:
                        evidence.source || null,

                    content:
                        evidence.content || null,

                    origin:
                        evidence.origin || null,

                    epistemicState:
                        evidence.epistemicState || null,

                    verificationStatus:
                        evidence.verificationStatus || null,

                    verificationBasis:
                        evidence.verificationBasis ?? null,

                    externalVerificationClaim:
                        evidence.externalVerificationClaim === true,

                    externalVerificationBasis:
                        evidence.externalVerificationBasis ?? null,

                    runtimeVerificationRecord:
                        evidence.runtimeVerificationRecord === true,

                    independent:
                        evidence.independent === true,

                    sourceAvailable:
                        evidence.sourceAvailable === true,

                    supportsClaim:
                        evidence.supportsClaim === true,

                    evidenceBoundary:
                        evidence.evidenceBoundary || null

                };

            }
        );

    }


    /*
     * =========================================================
     * Correspondence
     * =========================================================
     */

    projectCorrespondence(correspondence) {

        if (
            !correspondence ||
            typeof correspondence !== "object"
        ) {

            return null;

        }

        return {

            engine:
                correspondence.engine || null,

            version:
                correspondence.version || null,

            principle:
                correspondence.principle || null,

            status:
                correspondence.status || null,

            metadata:
                this.projectMetadata(
                    correspondence.metadata
                ),

            correspondences:
                this.projectCorrespondences(
                    correspondence.correspondences
                ),

            questions:
                this.safeClone(
                    correspondence.questions || []
                )

        };

    }


    projectCorrespondences(items) {

        if (
            !Array.isArray(items)
        ) {

            return [];

        }

        return items.map(
            item => {

                if (
                    !item ||
                    typeof item !== "object"
                ) {

                    return item;

                }

                return {

                    definitionCount:
                        item.definitionCount || 0,

                    evidenceCount:
                        item.evidenceCount || 0,

                    verifiedEvidenceCount:
                        item.verifiedEvidenceCount || 0,

                    unverifiedEvidenceCount:
                        item.unverifiedEvidenceCount || 0,

                    matched:
                        item.matched === true,

                    supported:
                        item.supported === true,

                    sourceAvailable:
                        item.sourceAvailable === true,

                    verifiedSourceAvailable:
                        item.verifiedSourceAvailable === true,

                    sourceCount:
                        item.sourceCount || 0,

                    verificationStatus:
                        item.verificationStatus || null,

                    epistemicState:
                        item.epistemicState || null,

                    definition:
                        this.safeClone(
                            item.definition
                        ),

                    responsibilityBoundary:
                        item.responsibilityBoundary || null,

                    knowledgeBoundary:
                        item.knowledgeBoundary || null

                };

            }
        );

    }


    /*
     * =========================================================
     * Reasoning
     * =========================================================
     */

    projectReasoning(reasoning) {

        if (
            !reasoning ||
            typeof reasoning !== "object"
        ) {

            return null;

        }

        return {

            engine:
                reasoning.engine || null,

            version:
                reasoning.version || null,

            principle:
                reasoning.principle || null,

            status:
                reasoning.status || null,

            metadata:
                this.projectMetadata(
                    reasoning.metadata
                ),

            questions:
                this.safeClone(
                    reasoning.questions || []
                ),

            reasonings:
                this.projectReasonings(
                    reasoning.reasonings
                )

        };

    }


    projectReasonings(items) {

        if (
            !Array.isArray(items)
        ) {

            return [];

        }

        return items.map(
            item => {

                if (
                    !item ||
                    typeof item !== "object"
                ) {

                    return item;

                }

                return {

                    definition:
                        this.safeClone(
                            item.definition
                        ),

                    evidenceCount:
                        item.evidenceCount || 0,

                    verifiedEvidenceCount:
                        item.verifiedEvidenceCount || 0,

                    sourceAvailable:
                        item.sourceAvailable === true,

                    sourceCount:
                        item.sourceCount || 0,

                    supported:
                        item.supported === true,

                    epistemicState:
                        item.epistemicState || null,

                    reasoningStrength:
                        item.reasoningStrength || null,

                    hiddenAssumptions:
                        this.safeClone(
                            item.hiddenAssumptions || []
                        ),

                    reasoningLeap:
                        this.safeClone(
                            item.reasoningLeap
                        ),

                    reasoningType:
                        item.reasoningType || null,

                    verificationStatus:
                        item.verificationStatus || null,

                    conclusionBoundary:
                        item.conclusionBoundary || null

                };

            }
        );

    }


    /*
     * =========================================================
     * Responsibility
     * =========================================================
     */

    projectResponsibility(responsibility) {

        if (
            !responsibility ||
            typeof responsibility !== "object"
        ) {

            return null;

        }

        return {

            engine:
                responsibility.engine || null,

            version:
                responsibility.version || null,

            principle:
                responsibility.principle || null,

            status:
                responsibility.status || null,

            metadata:
                this.projectMetadata(
                    responsibility.metadata
                ),

            questions:
                this.safeClone(
                    responsibility.questions || []
                ),

            responsibilities:
                this.projectResponsibilities(
                    responsibility.responsibilities
                )

        };

    }


    projectResponsibilities(items) {

        if (
            !Array.isArray(items)
        ) {

            return [];

        }

        return items.map(
            item => {

                if (
                    !item ||
                    typeof item !== "object"
                ) {

                    return item;

                }

                return {

                    expression:
                        item.expression || null,

                    definition:
                        this.safeClone(
                            item.definition
                        ),

                    supported:
                        item.supported === true,

                    epistemicState:
                        item.epistemicState || null,

                    evidenceCount:
                        item.evidenceCount || 0,

                    verifiedEvidenceCount:
                        item.verifiedEvidenceCount || 0,

                    sourceCount:
                        item.sourceCount || 0,

                    sourceAvailable:
                        item.sourceAvailable === true,

                    verifiedSourceCount:
                        item.verifiedSourceCount || 0,

                    verifiedSourceAvailable:
                        item.verifiedSourceAvailable === true,

                    sources:
                        this.safeClone(
                            item.sources || []
                        ),

                    verifiedSources:
                        this.safeClone(
                            item.verifiedSources || []
                        ),

                    responsibilityDemand:
                        this.safeClone(
                            item.responsibilityDemand
                        ),

                    responsibilityCapacity:
                        this.safeClone(
                            item.responsibilityCapacity
                        ),

                    responsibilityBoundary:
                        this.safeClone(
                            item.responsibilityBoundary
                        ),

                    responsibilityJudgment:
                        this.safeClone(
                            item.responsibilityJudgment
                        ),

                    expressionResponsibility:
                        item.expressionResponsibility || null,

                    evidenceResponsibility:
                        item.evidenceResponsibility || null,

                    sourceResponsibility:
                        item.sourceResponsibility || null,

                    verificationResponsibility:
                        item.verificationResponsibility || null,

                    responsibilityType:
                        item.responsibilityType || null,

                    verificationStatus:
                        item.verificationStatus || null

                };

            }
        );

    }


    /*
     * =========================================================
     * Reconstruction
     * =========================================================
     */

    projectReconstruction(reconstruction) {

        if (
            !reconstruction ||
            typeof reconstruction !== "object"
        ) {

            return null;

        }

        const data =
            reconstruction.reconstruction ||
            reconstruction;

        return {

            engine:
                reconstruction.engine || null,

            version:
                reconstruction.version || null,

            principle:
                reconstruction.principle || null,

            status:
                reconstruction.status || null,

            metadata:
                this.projectMetadata(
                    reconstruction.metadata
                ),

            reconstruction: {

                originalExpression:
                    data.originalExpression || null,

                reconstructedExpression:
                    data.reconstructedExpression || null,

                language:
                    this.safeClone(
                        data.language
                    ),

                responsibilityCount:
                    data.responsibilityCount || 0,

                responsibilityChain:
                    this.projectResponsibilities(
                        data.responsibilityChain
                    ),

                evidenceChain:
                    this.safeClone(
                        data.evidenceChain || []
                    ),

                sources:
                    this.safeClone(
                        data.sources || []
                    ),

                sourceCount:
                    data.sourceCount || 0,

                boundaries:
                    this.safeClone(
                        data.boundaries || {}
                    ),

                expansion:
                    data.expansion === true,

                reconstructionType:
                    data.reconstructionType || null,

                verificationStatus:
                    data.verificationStatus || null

            }

        };

    }


    /*
     * =========================================================
     * Generator
     * =========================================================
     */

    projectGenerator(generator) {

        if (
            !generator ||
            typeof generator !== "object"
        ) {

            return null;

        }

        const report =
            generator.report || {};

        return {

            engine:
                generator.engine || null,

            version:
                generator.version || null,

            principle:
                generator.principle || null,

            status:
                generator.status || null,

            generator:
                generator.generator === true,

            metadata:
                this.projectMetadata(
                    generator.metadata
                ),

            report: {

                expression:
                    report.expression || null,

                reconstructedExpression:
                    report.reconstructedExpression || null,

                reconstructionState:
                    report.reconstructionState || null,

                language:
                    this.safeClone(
                        report.language
                    ),

                responsibilities:
                    this.projectResponsibilities(
                        report.responsibilities
                    ),

                responsibilityCount:
                    report.responsibilityCount || 0,

                evidenceChain:
                    this.safeClone(
                        report.evidenceChain || []
                    ),

                sources:
                    this.safeClone(
                        report.sources || []
                    ),

                sourceCount:
                    report.sourceCount || 0,

                boundaries:
                    this.safeClone(
                        report.boundaries || {}
                    ),

                expansion:
                    report.expansion === true,

                sourceExpansion:
                    report.sourceExpansion === true,

                evidenceExpansion:
                    report.evidenceExpansion === true,

                publishable:
                    report.publishable === true,

                publishableText:
                    typeof generator.publishableText === "string"
                        ? generator.publishableText
                        : "",

                reportType:
                    report.reportType || null,

                verificationStatus:
                    report.verificationStatus || null

            },

            questions:
                this.safeClone(
                    generator.questions || []
                )

        };

    }

    /*
     * =========================================================
     * SelfCheck
     * =========================================================
     */

    projectSelfCheck(selfCheck) {

        if (
            !selfCheck ||
            typeof selfCheck !== "object"
        ) {

            return null;

        }

        const result =
            selfCheck.result || {};

        return {

            engine:
                selfCheck.engine || null,

            version:
                selfCheck.version || null,

            principle:
                selfCheck.principle || null,

            status:
                selfCheck.status || null,

            passed:
                result.passed === true,

            questions:
                this.safeClone(
                    selfCheck.questions ||
                    result.questions ||
                    []
                ),

            metadata:
                this.projectMetadata(
                    selfCheck.metadata ||
                    result.metadata
                )

        };

    }


    /*
     * =========================================================
     * Responsibility Event
     * =========================================================
     */

    projectResponsibilityEvent(event) {

        if (
            !event ||
            typeof event !== "object"
        ) {

            return null;

        }

        return {

            type:
                event.type || null,

            version:
                event.version || null,

            createdAt:
                event.createdAt || null,

            source:
                event.source || null,

            runtimeVersion:
                event.runtimeVersion || null,

            contractVersion:
                event.contractVersion || null,

            expression:
                event.expression || null,

            testimony:
                this.projectTestimony(
                    event.testimony
                ),

            epistemicState:
                event.epistemicState || null,

            verificationBoundary:
                this.safeClone(
                    event.verificationBoundary
                ),

            responsibilityBoundary:
                this.safeClone(
                    event.responsibilityBoundary
                ),

            verificationStatus:
                event.verificationStatus || null,

            supported:
                event.supported === true,

            responsibilityCapacity:
                this.safeClone(
                    event.responsibilityCapacity
                ),

            responsibilityDemand:
                this.safeClone(
                    event.responsibilityDemand
                ),

            responsibilityJudgment:
                this.safeClone(
                    event.responsibilityJudgment
                ),

            runtimeIdentity:
                this.safeClone(
                    event.runtimeIdentity
                ),

            boundary:
                this.safeClone(
                    event.boundary
                )

        };

    }


    /*
     * =========================================================
     * Metadata
     * =========================================================
     */

    projectMetadata(metadata) {

        if (
            !metadata ||
            typeof metadata !== "object"
        ) {

            return null;

        }

        return {

            generatedAt:
                metadata.generatedAt || null,

            reconstructedAt:
                metadata.reconstructedAt || null,

            runtimeVersion:
                metadata.runtimeVersion || null,

            contractVersion:
                metadata.contractVersion || null,

            engine:
                metadata.engine || null,

            version:
                metadata.version || null,

            status:
                metadata.status || null,

            engineCount:
                metadata.engineCount || 0,

            traceCount:
                metadata.traceCount || 0,

            evidenceCount:
                metadata.evidenceCount || 0,

            verifiedCount:
                metadata.verifiedCount || 0,

            unverifiedCount:
                metadata.unverifiedCount || 0,

            discoveredCount:
                metadata.discoveredCount || 0,

            supportedCount:
                metadata.supportedCount || 0,

            unknownCount:
                metadata.unknownCount || 0

        };

    }


    /*
     * =========================================================
     * Boundary
     * =========================================================
     */

    projectBoundary(boundary) {

        if (
            !boundary ||
            typeof boundary !== "object"
        ) {

            return null;

        }

        return {

            epistemic:
                boundary.epistemic || null,

            verification:
                boundary.verification || null,

            responsibility:
                this.safeClone(
                    boundary.responsibility
                ),

            supported:
                boundary.supported === true

        };

    }


    /*
     * =========================================================
     * Trace
     * =========================================================
     *
     * Trace 鍙厑璁镐繚瀛樻渶灏忚繍琛屽璁′俊鎭€?
     * =========================================================
     */

    buildTrace(trace) {

        if (
            !Array.isArray(trace)
        ) {

            return [];

        }

        return trace.map(
            item => {

                if (
                    !item ||
                    typeof item !== "object"
                ) {

                    return item;

                }

                return {

                    engine:
                        item.engine || null,

                    status:
                        item.status || null,

                    version:
                        item.version || null,

                    action:
                        item.action || null

                };

            }
        );

    }


    /*
     * =========================================================
     * Safe Scalar / Small Object Clone
     * =========================================================
     *
     * 姝ゆ柟娉曞彧鐢ㄤ簬宸茬粡缁忚繃瀛楁鐧藉悕鍗曠瓫閫夌殑灏忓璞°€?
     *
     * 瀹冧笉鍐嶈礋璐ｉ亶鍘嗘暣涓?Runtime Object Graph銆?
     * =========================================================
     */

    safeClone(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return value ?? null;

        }

        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {

            return value;

        }

        if (
            typeof value === "function" ||
            typeof value === "symbol"
        ) {

            return undefined;

        }

        if (
            Array.isArray(value)
        ) {

            return value.map(
                item =>
                    this.safeClone(
                        item
                    )
            );

        }

        if (
            typeof value === "object"
        ) {

            const output = {};

            for (
                const [key, item]
                of Object.entries(value)
            ) {

                if (
                    key === "runtimeContext" ||
                    key === "runtimeObject" ||
                    key === "semanticObject" ||
                    key === "engineRegistry" ||
                    key === "engines" ||
                    key === "registry" ||
                    key === "result" ||
                    key === "trace" ||
                    key === "runtimeTrace"
                ) {

                    continue;

                }

                const cloned =
                    this.safeClone(
                        item
                    );

                if (
                    cloned !== undefined
                ) {

                    output[key] =
                        cloned;

                }

            }

            return output;

        }

        return null;

    }

}


export default ReportFormatter;
