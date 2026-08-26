const RuntimeContract = {

    version:
        "10.7",

    principles: {

        definition:
            "没有定义，就没有推理。",

        runtime:
            "没有 Contract，就没有 Runtime。",

        registry:
            "没有注册，就没有可信运行。",

        result:
            "没有 RuntimeResult，就没有统一运行结果。",

        epistemicBoundary:
            "搜索可以扩大所见，但不能扩大所证。",

        evidenceBoundary:
            "所见信息不得自动成为已验证证据。",

        correspondenceBoundary:
            "证据存在不得自动等于证据支持表达。",

        reasoningBoundary:
            "推理不得超过已经验证的对应关系和证据支持范围。",

        responsibilityBoundary:
            "责任要求不得超过当前责任链能够承担的范围。",

        ignoranceBoundary:
            "证据不足时必须允许 UNKNOWN，不得将未知强制解释为错误。",

        externalLanguageBoundary:
            "语言系统属于外部表达环境，莫问只连接、携带并运行，不拥有、不制造、不替代。",

        lifecycleBoundary:
            "Runtime 只有完成全部 Engine 执行、Registry 校验、SelfCheck 并进入 RuntimeClosed 后，才允许返回最终 RuntimeResult。",

        responsibilityEventBoundary:
            "ResponsibilityEvent 必须来源于已经完成 SelfCheck 的 RuntimeResult，并通过事件自身验证，不允许绕过 Runtime 生命周期直接发布责任事件。"

    },


    mwalEvidenceFlowContract: {

        required:
            true,

        flow: [

            {
                from:
                    "EvidenceEngine",

                output:
                    "evidences"
            },

            {
                from:
                    "RuntimeContext",

                output:
                    "EvidenceRecord"
            },

            {
                to:
                    "CorrespondenceEngine",

                input:
                    "evidences"
            }

        ],

        rules: {

            evidenceCannotDisappearBeforeCorrespondence:
                true,

            emptyEvidenceMustRemainEmpty:
                true,

            correspondenceCannotReadUnlinkedEvidence:
                true

        }

    },
    externalLanguageContract: {

        owner:
            "external",

        runtimeRole:
            "responsibility-runtime",

        allowedFunctions: [

            "supply",
            "connect",
            "preserve",
            "carry"

        ],

        prohibitedFunctions: [

            "runtime-ownership",
            "runtime-creation",
            "runtime-replacement",
            "unverified-language-construction"

        ],

        identityPreservation:
            true,

        sameObjectRequired:
            true,

        runtimeMustNotOwn:
            true,

        runtimeMustNotCreate:
            true,

        runtimeMustNotInterpret:
            true

    },

    identity: {

        name:
            "MoWen Runtime",

        runtimeVersion:
            "10.7",

        contractVersion:
            "10.7"

    },

    epistemicStates: {

        discovered:
            "DISCOVERED",

        unverified:
            "UNVERIFIED",

        verified:
            "VERIFIED",

        verifiedButNotLinked:
            "VERIFIED_BUT_NOT_LINKED",

        supported:
            "SUPPORTED",

        contradicted:
            "CONTRADICTED",

        unknown:
            "UNKNOWN",

        partial:
            "PARTIAL",

        unresolved:
            "UNRESOLVED",

        outOfDomain:
            "OUT_OF_DOMAIN"

    },

    epistemicRules: {

        discoveredIsNotVerified:
            true,

        verifiedIsNotAutomaticallySupported:
            true,

        verifiedDoesNotMeanLinked:
            true,

        verifiedButNotLinkedCannotBecomeSupportedWithoutCorrespondence:
            true,

        supportRequiresVerifiedEvidence:
            true,

        supportRequiresCorrespondence:
            true,

        contradictionRequiresSufficientCounterEvidence:
            true,

        insufficientEvidenceAllowsUnknown:
            true,

        unknownIsNotFalse:
            true,

        unknownIsNotTrue:
            true,

        searchCannotExpandProof:
            true,

        searchCannotCreateEvidence:
            true,

        reasoningCannotExceedEvidence:
            true,

        responsibilityCannotExceedSupport:
            true

    },

    boundaryTransitions: {

        search: {

            input:
                "Expression",

            output:
                "DISCOVERED",

            mayBecome:
                [
                    "UNVERIFIED"
                ],

            prohibited:
                [
                    "VERIFIED",
                    "VERIFIED_BUT_NOT_LINKED",
                    "SUPPORTED",
                    "CONTRADICTED"
                ]

        },

        evidence: {

            input:
                "DISCOVERED",

            output:
                "UNVERIFIED",

            mayBecome:
                [
                    "VERIFIED",
                    "UNKNOWN",
                    "UNRESOLVED"
                ],

            verifiedRequires:
                "explicit-verification",

            prohibitedAutomaticPromotion:
                [
                    "VERIFIED_BUT_NOT_LINKED",
                    "SUPPORTED",
                    "CONTRADICTED"
                ]

        },

        correspondence: {

            requires:
                [
                    "VERIFIED"
                ],

            output:
                [
                    "SUPPORTED",
                    "VERIFIED_BUT_NOT_LINKED",
                    "UNRESOLVED"
                ],

            supportedRequires:
                "verified-correspondence"

        },

        reasoning: {

            requires:
                [
                    "VERIFIED",
                    "VERIFIED_BUT_NOT_LINKED",
                    "SUPPORTED"
                ],

            allowedOutput:
                [
                    "SUPPORTED",
                    "CONTRADICTED",
                    "UNKNOWN",
                    "PARTIAL",
                    "UNRESOLVED"
                ]

        },

        responsibility: {

            requires:
                "reasoning-result",

            allowedOutput:
                [
                    "SUPPORTED",
                    "CONTRADICTED",
                    "UNKNOWN",
                    "PARTIAL",
                    "UNRESOLVED"
                ],

            prohibitedPromotion:
                [
                    "UNKNOWN->FALSE",
                    "UNKNOWN->TRUE",
                    "VERIFIED_BUT_NOT_LINKED->SUPPORTED"
                ]

        }

    },

    domainKnowledgeContract: {

        purpose:
            "为专业领域提供相关定义、规则、标准、关系和来源，不直接替 Runtime 制造结论。",

        allowedFunctions: [
            "definition",
            "terminology",
            "rule",
            "standard",
            "relationship",
            "source-discovery",
            "domain-context"
        ],

        prohibitedFunctions: [
            "automatic-certainty",
            "automatic-support",
            "automatic-conclusion",
            "automatic-contradiction"
        ]

    },

    pipeline: {

        input:
            "Expression",

        output:
            "RuntimeResult",

        engines: [

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

        ]

    },

    engineContract: {

        version:
            "2.1",

        requiredFields: [

            "engine",
            "version",
            "status",
            "result",
            "trace",
            "questions",
            "nextRuntimeState",
            "principle",
            "metadata"

        ],

        fieldTypes: {

            engine:
                "string",

            version:
                "string",

            status:
                "string",

            principle:
                "string",

            metadata:
                "object",

            result:
                "object",

            trace:
                "array",

            questions:
                "array",

            nextRuntimeState:
                "string"

        }

    },

    searchContract: {

        outputState:
            "DISCOVERED",

        requiredFields: [
            "source",
            "content"
        ],

        verificationStatus:
            "UNVERIFIED",

        rules: {

            mayExpandInformation:
                true,

            mayCreateEvidence:
                false,

            mayCreateConclusion:
                false,

            mayPromoteToVerified:
                false

        }

    },

    evidenceContract: {

        allowedStates: [
            "UNVERIFIED",
            "VERIFIED"
        ],

        requiredFields: [
            "source",
            "content",
            "verificationStatus"
        ],

        verifiedRequires:
            "explicit-verification",

        rules: {

            searchResultIsNotAutomaticallyVerified:
                true,

            sourceRequired:
                true,

            contentRequired:
                true

        }

    },

    correspondenceContract: {

        requiredInputs: [
            "definition",
            "verifiedEvidence"
        ],

        requiredFields: [
            "matched",
            "supported",
            "verificationStatus"
        ],

        rules: {

            existenceDoesNotEqualSupport:
                true,

            supportRequiresSpecificCorrespondence:
                true,

            verifiedButNotLinkedMustRemainExplicit:
                true,

            unsupportedCorrespondenceMustRemainUnresolved:
                true

        }

    },

    reasoningContract: {

        allowedStates: [
            "SUPPORTED",
            "CONTRADICTED",
            "UNKNOWN",
            "PARTIAL",
            "UNRESOLVED"
        ],

        rules: {

            evidenceRequiredForSupport:
                true,

            correspondenceRequiredForSupport:
                true,

            verifiedButNotLinkedCannotBeTreatedAsSupport:
                true,

            insufficientSupportMeansUnknown:
                true,

            noEvidenceDoesNotMeanFalse:
                true,

            reasoningCannotExceedEvidence:
                true

        }

    },

    responsibilityContract: {

        allowedStates: [
            "SUPPORTED",
            "CONTRADICTED",
            "UNKNOWN",
            "PARTIAL",
            "UNRESOLVED"
        ],

        rules: {

            demandCannotExceedCapacity:
                true,

            evidenceQualityMatters:
                true,

            evidenceQuantityAloneIsInsufficient:
                true,

            unknownMustRemainUnknown:
                true,

            unsupportedConclusionCannotBePromoted:
                true,

            verifiedButNotLinkedCannotCarrySupportResponsibility:
                true

        }

    },

    runtimeLifecycleContract: {

        required:
            true,

        pipelineMustComplete:
            true,

        registryMustComplete:
            true,

        registryValidationRequired:
            true,

        registryVersionValidationRequired:
            true,

        selfCheckRequired:
            true,

        selfCheckMustPass:
            true,

        runtimeClosedStateRequired:
            true,

        executionPendingMustBeZero:
            true,

        runtimeResultMayReturnOnlyAfterClosure:
            true,

        requiredRuntimeState:
            "RuntimeClosed"

    },

    responsibilityEventContract: {

        required:
            true,

        type:
            "MWAL.ResponsibilityEvent",

        source:
            "MoWen Runtime",

        requiresRuntimeClosure:
            true,

        requiresSelfCheckPassed:
            true,

        requiresValidation:
            true,

        validationMustPass:
            true,

        publishabilityMustBeDerivedFromValidatedEvent:
            true,

        bypassProhibited:
            true

    },

    runtimeResultContract: {

        requiredFields: [

            "runtimeVersion",
            "generatedAt",
            "metadata",
            "recognition",
            "definition",
            "testimony",
            "testimonyValidation",
            "search",
            "evidence",
            "runtimeVerification",
            "correspondence",
            "reasoning",
            "responsibility",
            "responsibilityModel",
            "reconstruction",
            "generator",
            "selfCheck",
            "engineRegistry",
            "testimonyChain",
            "verificationBoundary",
            "identity",
            "contract",
            "semanticObject",
            "runtimeTrace",
            "pipeline",
            "epistemicState",
            "epistemicBoundary"

        ]

    },

    metadataContract: {

        requiredFields: [

            "runtimeVersion",
            "contractVersion",
            "engineCount",
            "generatedAt"

        ]

    },

    registryContract: {

        required:
            true,

        requiredMetadataFields: [

            "name",
            "version",
            "status",
            "nextRuntimeState",
            "capabilities"

        ]

    },

    executionContract: {

        required:
            true,

        principle:
            "Every Engine must provide a unified execution capability."

    }

};

export default RuntimeContract;


