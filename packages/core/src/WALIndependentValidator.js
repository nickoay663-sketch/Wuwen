import WALContract from "./WALContract.js";

class WALIndependentValidator {

    constructor() {
        this.name = "WAL Independent Validator";
        this.version = "1.1";
        this.standard = "WAL Standard Core v1.0";
        this.ruleInventory = "WAL Rule Inventory v1.0";
    }

    validateEnvelope(
        envelope = {},
        originalExpression = undefined,
        testimony = undefined,
        responsibilityEvent = undefined
    ) {

        const contractValidation =
            WALContract.validate(envelope);

        const checks = [];

        /*
         * =====================================================
         * CORE-01 鈥?Expression / Semantic Boundary
         * =====================================================
         */

        checks.push({
            rule: "WAL-R01-01",
            name: "Original expression identity is preserved",
            passed:
                originalExpression === undefined ||
                envelope.expression === originalExpression
        });

        checks.push({
            rule: "WAL-R01-02",
            name: "Expression is not substituted during analysis",
            passed:
                originalExpression === undefined ||
                (
                    envelope.expression === originalExpression &&
                    (
                        testimony === undefined ||
                        testimony?.originalInput?.originalExpression === undefined ||
                        testimony.originalInput.originalExpression ===
                            originalExpression
                    )
                )
        });

        checks.push({
            rule: "WAL-R01-03",
            name: "Original expression remains traceable through responsibility chain",
            passed:
                originalExpression === undefined ||
                (
                    responsibilityEvent !== undefined &&
                    responsibilityEvent?.expression === originalExpression &&
                    (
                        responsibilityEvent?.testimony === undefined ||
                        typeof responsibilityEvent?.testimony === "string" ||
                        responsibilityEvent?.testimony?.originalInput?.originalExpression ===
                            originalExpression
                    )
                )
        });

        checks.push({
            rule: "WAL-R01-04",
            name: "Definition answers what the expression object is without inventing meaning",
            passed:
                !(
                    envelope.definition &&
                    envelope.definition.syntheticMeaning === true
                )
        });

        checks.push({
            rule: "WAL-R01-05",
            name: "Runtime does not own an externally supplied language system",
            passed:
                !(
                    envelope.languageSystem &&
                    envelope.languageSystem.runtimeOwned === true
                )
        });

        checks.push({
            rule: "WAL-R01-06",
            name: "Runtime does not create or replace the external language system",
            passed:
                !(
                    envelope.languageSystem &&
                    envelope.languageSystem.runtimeCreated === true
                )
        });

        checks.push({
            rule: "WAL-R01-07",
            name: "Undefined objects are not forcibly introduced into reasoning",
            passed:
                envelope.undefinedObjectsIntroduced !== true
        });

        checks.push({
            rule: "WAL-R01-08",
            name: "Language identification does not become factual verification",
            passed:
                !(
                    envelope.languageIdentification === true &&
                    (
                        envelope.verificationState === "VERIFIED" ||
                        envelope.verificationState === "SUPPORTED"
                    ) &&
                    envelope.verificationBasis === "LANGUAGE_IDENTIFICATION"
                )
        });

        checks.push({
            rule: "WAL-R01-09",
            name: "Semantic analysis does not become evidence",
            passed:
                !(
                    envelope.semanticAnalysisUsedAsEvidence === true
                )
        });

        checks.push({
            rule: "WAL-R01-10",
            name: "Expression restatement does not silently change the original claim",
            passed:
                originalExpression === undefined ||
                envelope.restatedExpression === undefined ||
                envelope.restatedExpression === originalExpression ||
                envelope.restatedExpressionPreservesClaim === true
        });

        /*
         * =====================================================
         * CORE-00 鈥?Cross-Core Invariants
         * =====================================================
         */

        checks.push({
            rule: "WAL-R00-01",
            name: "WAL contract structural validity",
            passed:
                contractValidation.valid === true
        });

        checks.push({
            rule: "WAL-R00-02",
            name: "Evidence determines the maximum responsibility assumed",
            passed:
                responsibilityWithinEvidence(envelope)
        });

        checks.push({
            rule: "WAL-R00-03",
            name: "No unsupported certainty is created",
            passed:
                !(
                    isHighCertainty(envelope) &&
                    !hasEvidence(envelope)
                )
        });

        checks.push({
            rule: "WAL-R00-04",
            name: "Evidence is not manufactured",
            passed:
                !(
                    envelope.manufacturedEvidence === true ||
                    envelope.reconstructionManufacturedEvidence === true ||
                    containsManufacturedEvidence(envelope)
                )
        });

        checks.push({
            rule: "WAL-R00-05",
            name: "Knowledge is not manufactured",
            passed:
                !(
                    envelope.manufacturedKnowledge === true ||
                    envelope.reconstructionManufacturedKnowledge === true ||
                    containsManufacturedKnowledge(envelope)
                )
        });

        checks.push({
            rule: "WAL-R00-06",
            name: "Runtime closure does not imply factual verification",
            passed:
                !(
                    envelope.runtimeState === "RuntimeClosed" &&
                    envelope.verificationState === "VERIFIED" &&
                    envelope.factualVerification === false
                )
        });

        checks.push({
            rule: "WAL-R00-07",
            name: "Runtime internals do not cross the WAL boundary",
            passed:
                getLeakedRuntimeFields(envelope).length === 0
        });

        checks.push({
            rule: "WAL-R00-08",
            name: "Publication authority remains distinct from truth determination",
            passed:
                envelope.propagationState !== "ALLOW" ||
                (
                    envelope.verificationState === "SUPPORTED" ||
                    envelope.verificationState === "VERIFIED"
                )
        });

        /*
         * =====================================================
         * CORE-02 鈥?Information / Evidence / Correspondence
         * =====================================================
         */

        checks.push({
            rule: "WAL-R02-01",
            name: "Search results are not automatically evidence",
            passed:
                !(
                    Array.isArray(envelope.searchResults) &&
                    envelope.searchResults.length > 0 &&
                    Array.isArray(envelope.evidence) &&
                    envelope.evidence.length === envelope.searchResults.length &&
                    sameSearchAndEvidence(envelope.searchResults, envelope.evidence)
                )
        });

        checks.push({
            rule: "WAL-R02-02",
            name: "Discovered information remains distinguishable from verified information",
            passed:
                !(
                    envelope.discoveryState === "DISCOVERED" &&
                    envelope.verificationState === "VERIFIED"
                )
        });

        checks.push({
            rule: "WAL-R02-03",
            name: "Evidence remains distinguishable from source existence",
            passed:
                !(
                    envelope.sourceExists === true &&
                    envelope.evidenceDerivedFromExistence === true
                )
        });

        checks.push({
            rule: "WAL-R02-04",
            name: "Source existence alone does not establish correspondence",
            passed:
                !(
                    envelope.sourceExists === true &&
                    envelope.correspondence === true &&
                    envelope.correspondenceBasis === "SOURCE_EXISTS"
                )
        });

        checks.push({
            rule: "WAL-R02-05",
            name: "Evidence does not become support without required conditions",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasSupportedBasis(envelope)
        });

        checks.push({
            rule: "WAL-R02-06",
            name: "SUPPORTED requires a definition",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasDefinition(envelope)
        });

        checks.push({
            rule: "WAL-R02-07",
            name: "SUPPORTED requires independent evidence",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasIndependentEvidence(envelope)
        });

        checks.push({
            rule: "WAL-R02-08",
            name: "SUPPORTED requires explicit verification",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasExplicitVerification(envelope)
        });

        checks.push({
            rule: "WAL-R02-09",
            name: "SUPPORTED requires explicit correspondence",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasExplicitCorrespondence(envelope)
        });

        checks.push({
            rule: "WAL-R02-10",
            name: "DISCOVERED does not automatically promote to VERIFIED",
            passed:
                !(
                    envelope.discoveryState === "DISCOVERED" &&
                    envelope.verificationState === "VERIFIED"
                )
        });

        checks.push({
            rule: "WAL-R02-11",
            name: "UNVERIFIED does not automatically promote to VERIFIED",
            passed:
                !(
                    envelope.previousVerificationState === "UNVERIFIED" &&
                    envelope.verificationState === "VERIFIED"
                )
        });

        checks.push({
            rule: "WAL-R02-12",
            name: "VERIFIED does not automatically promote to SUPPORTED",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasSupportedBasis(envelope)
        });

        checks.push({
            rule: "WAL-R02-13",
            name: "VERIFIED_BUT_NOT_LINKED does not automatically promote to SUPPORTED",
            passed:
                !(
                    envelope.epistemicState === "VERIFIED_BUT_NOT_LINKED" &&
                    envelope.verificationState === "SUPPORTED"
                )
        });

        checks.push({
            rule: "WAL-R02-14",
            name: "UNKNOWN does not become TRUE",
            passed:
                !(
                    envelope.verificationState === "UNKNOWN" &&
                    envelope.epistemicState === "TRUE"
                )
        });

        checks.push({
            rule: "WAL-R02-15",
            name: "UNKNOWN does not become FALSE",
            passed:
                !(
                    envelope.verificationState === "UNKNOWN" &&
                    envelope.epistemicState === "FALSE"
                )
        });

        /*
         * =====================================================
         * CORE-03 鈥?Epistemic / Responsibility Boundary
         * =====================================================
         */

        checks.push({
            rule: "WAL-R03-01",
            name: "Responsibility does not exceed evidence and correspondence",
            passed:
                responsibilityWithinEvidence(envelope)
        });

        checks.push({
            rule: "WAL-R03-02",
            name: "Reasoning does not exceed established evidence boundary",
            passed:
                !(
                    hasReasoning(envelope) &&
                    reasoningExceedsEvidence(envelope)
                )
        });

        checks.push({
            rule: "WAL-R03-03",
            name: "Responsibility does not exceed reasoning support",
            passed:
                !(
                    responsibilityExceedsReasoning(envelope)
                )
        });

        checks.push({
            rule: "WAL-R03-04",
            name: "Later stages do not introduce absent certainty",
            passed:
                !(
                    laterStageIntroducesCertainty(envelope)
                )
        });

        checks.push({
            rule: "WAL-R03-05",
            name: "UNKNOWN remains valid",
            passed:
                envelope.verificationState !== "UNKNOWN" ||
                envelope.propagationState === "REQUIRE_VERIFICATION"
        });

        checks.push({
            rule: "WAL-R03-06",
            name: "UNKNOWN is not converted merely to satisfy output requirements",
            passed:
                !(
                    envelope.verificationState === "UNKNOWN" &&
                    envelope.propagationState === "ALLOW"
                )
        });

        checks.push({
            rule: "WAL-R03-07",
            name: "Known, unknown, verified and unverified states remain distinguishable",
            passed:
                typeof envelope.verificationState === "string" &&
                !(
                    envelope.knownState === envelope.unknownState &&
                    envelope.knownState !== undefined
                )
        });

        checks.push({
            rule: "WAL-R03-08",
            name: "Correspondence and non-correspondence remain distinguishable",
            passed:
                envelope.propagationState !== undefined &&
                !(
                    envelope.correspondence === true &&
                    envelope.nonCorrespondence === true
                )
        });

        checks.push({
            rule: "WAL-R03-09",
            name: "Responsibility boundary is exposed",
            passed:
                envelope.responsibility === null ||
                typeof envelope.responsibility === "object"
        });

        /*
         * =====================================================
         * CORE-04 鈥?Responsibility-Bounded Reconstruction
         * =====================================================
         */

        checks.push({
            rule: "WAL-R04-01",
            name: "Reconstruction is not used as punishment or censorship",
            passed:
                !(
                    envelope.reconstructionPurpose === "PUNISHMENT" ||
                    envelope.reconstructionPurpose === "CENSORSHIP"
                )
        });

        checks.push({
            rule: "WAL-R04-02",
            name: "Reconstruction may preserve genuine expression intent",
            passed:
                !(
                    envelope.reconstructionPreservesIntent === false &&
                    envelope.reconstructionIntentRequired === true
                )
        });

        checks.push({
            rule: "WAL-R04-03",
            name: "Reconstruction preserves content within responsibility boundary",
            passed:
                !(
                    envelope.reconstructionExceededResponsibility === true
                )
        });

        checks.push({
            rule: "WAL-R04-04",
            name: "Reconstruction may reduce unsupported certainty",
            passed:
                !(
                    envelope.reconstructionIncreasedCertainty === true
                )
        });

        checks.push({
            rule: "WAL-R04-05",
            name: "Unknown portions may remain explicitly unknown",
            passed:
                !(
                    envelope.unknownPortionsPreserved === false &&
                    envelope.unknownPortionsPresent === true
                )
        });

        checks.push({
            rule: "WAL-R04-06",
            name: "Reconstruction does not manufacture evidence",
            passed:
                envelope.reconstructionManufacturedEvidence !== true
        });

        checks.push({
            rule: "WAL-R04-07",
            name: "Reconstruction does not manufacture knowledge",
            passed:
                envelope.reconstructionManufacturedKnowledge !== true
        });

        checks.push({
            rule: "WAL-R04-08",
            name: "Generator does not increase certainty",
            passed:
                envelope.generatorIncreasedCertainty !== true
        });

        checks.push({
            rule: "WAL-R04-09",
            name: "Generator does not manufacture facts",
            passed:
                envelope.generatorManufacturedFacts !== true
        });

        checks.push({
            rule: "WAL-R04-10",
            name: "Automatic reconstruction stops when responsibility object or epistemic relationship changes",
            passed:
                !(
                    envelope.automaticReconstruction === true &&
                    (
                        envelope.reconstructionChangedResponsibilityObject === true ||
                        envelope.reconstructionChangedFactualRelationship === true ||
                        envelope.reconstructionChangedEvidenceRelationship === true ||
                        envelope.reconstructionChangedEpistemicState === true
                    )
                )
        });

        checks.push({
            rule: "WAL-R04-11",
            name: "Unsafe automatic reconstruction returns UNKNOWN or UNRESOLVED",
            passed:
                !(
                    envelope.automaticReconstructionUnsafe === true &&
                    envelope.verificationState !== "UNKNOWN" &&
                    envelope.resolutionState !== "UNRESOLVED"
                )
        });

        checks.push({
            rule: "WAL-R04-12",
            name: "Publication is not used to justify boundary violations",
            passed:
                !(
                    envelope.publicationJustifiesBoundaryViolation === true
                )
        });

        /*
         * =====================================================
         * Final Result
         * =====================================================
         */

        const failedRules =
            checks.filter(
                check => check.passed !== true
            );

        return {
            validator: this.name,
            validatorVersion: this.version,
            standard: this.standard,
            ruleInventory: this.ruleInventory,
            passed: failedRules.length === 0,
            status:
                failedRules.length === 0
                    ? "CONFORM"
                    : "NON_CONFORM",
            totalRulesChecked: checks.length,
            passedRules:
                checks.filter(
                    check => check.passed === true
                ).length,
            failedRules,
            checks
        };
    }
}


/*
 * =============================================================
 * Independent Predicates
 * =============================================================
 */

function getResponsibility(envelope) {
    return (
        envelope?.responsibility &&
        typeof envelope.responsibility === "object"
            ? envelope.responsibility
            : null
    );
}

function getBasis(envelope) {
    return getResponsibility(envelope)?.basis || null;
}

function getLimitations(envelope) {
    return getResponsibility(envelope)?.limitations || null;
}

function hasEvidence(envelope) {
    return (
        Array.isArray(envelope?.evidence) &&
        envelope.evidence.length > 0
    );
}

function isHighCertainty(envelope) {
    return (
        envelope?.epistemicState === "CERTAIN" ||
        envelope?.epistemicState === "TRUE" ||
        envelope?.verificationState === "VERIFIED"
    );
}

function getLeakedRuntimeFields(envelope) {

    const forbiddenRuntimeFields = [
        "semanticObject",
        "engineRegistry",
        "engines",
        "runtimeContext",
        "metadata",
        "trace",
        "nextRuntimeState",
        "runtimeTrace"
    ];

    return forbiddenRuntimeFields.filter(
        field =>
            Object.prototype.hasOwnProperty.call(
                envelope,
                field
            )
    );
}

function hasDefinition(envelope) {

    const basis = getBasis(envelope);

    return Boolean(
        basis?.definition ||
        envelope.definition
    );
}

function hasIndependentEvidence(envelope) {

    const basis = getBasis(envelope);

    const verifiedEvidenceCount =
        Number(
            basis?.verifiedEvidenceCount ??
            envelope.verifiedEvidenceCount ??
            0
        );

    const evidenceCount =
        Number(
            basis?.evidenceCount ??
            envelope.evidenceCount ??
            0
        );

    return (
        verifiedEvidenceCount > 0 &&
        evidenceCount > 0
    );
}

function hasExplicitVerification(envelope) {

    const basis = getBasis(envelope);

    const verificationStatus =
        basis?.verificationStatus ??
        envelope.verificationStatus ??
        null;

    return (
        verificationStatus === "VERIFIED" ||
        verificationStatus === "SUPPORTED"
    );
}

function hasExplicitCorrespondence(envelope) {

    const responsibility = getResponsibility(envelope);
    const limitations = getLimitations(envelope);

    const correspondence =
        envelope.correspondence ??
        responsibility?.correspondence ??
        limitations?.correspondence ??
        null;

    if (correspondence === true) {
        return true;
    }

    if (
        typeof correspondence === "object" &&
        correspondence !== null
    ) {
        return (
            correspondence.status === "matched" ||
            correspondence.matched === true ||
            correspondence.corresponds === true
        );
    }

    return false;
}

function hasSupportedBasis(envelope) {
    return (
        hasDefinition(envelope) &&
        hasIndependentEvidence(envelope) &&
        hasExplicitVerification(envelope) &&
        hasExplicitCorrespondence(envelope)
    );
}

function responsibilityWithinEvidence(envelope) {

    const responsibility = getResponsibility(envelope);

    if (!responsibility) {
        return true;
    }

    const basis = getBasis(envelope);

    const evidenceCount =
        Number(
            basis?.evidenceCount ??
            envelope.evidenceCount ??
            0
        );

    const verifiedEvidenceCount =
        Number(
            basis?.verifiedEvidenceCount ??
            envelope.verifiedEvidenceCount ??
            0
        );

    const responsibilityEvidenceCount =
        Number(
            basis?.responsibilityEvidenceCount ??
            responsibility?.evidenceCount ??
            0
        );

    if (
        responsibilityEvidenceCount > 0 &&
        responsibilityEvidenceCount > evidenceCount
    ) {
        return false;
    }

    if (
        responsibilityEvidenceCount > 0 &&
        verifiedEvidenceCount > 0 &&
        responsibilityEvidenceCount > verifiedEvidenceCount
    ) {
        return false;
    }

    if (
        (
            responsibility.state === "ESTABLISHED" ||
            responsibility.state === "CERTAIN"
        ) &&
        evidenceCount === 0
    ) {
        return false;
    }

    return true;
}

function containsManufacturedEvidence(envelope) {

    if (!Array.isArray(envelope?.evidence)) {
        return false;
    }

    return envelope.evidence.some(
        ev =>
            ev?.manufactured === true ||
            (
                typeof ev?.snippet === "string" &&
                ev.snippet.includes(
                    "MANUFACTURED_PLACEHOLDER"
                )
            )
    );
}

function containsManufacturedKnowledge(envelope) {

    const text =
        JSON.stringify(envelope);

    return (
        text.includes("SYNTHETIC_FABRICATION_MARKER") ||
        envelope?.knowledgeManufactured === true
    );
}

function sameSearchAndEvidence(
    searchResults,
    evidence
) {

    if (
        searchResults.length !== evidence.length
    ) {
        return false;
    }

    return searchResults.every(
        (search, index) =>
            JSON.stringify(search) ===
            JSON.stringify(evidence[index])
    );
}

function hasReasoning(envelope) {

    return (
        envelope.reasoning !== undefined &&
        envelope.reasoning !== null
    );
}

function reasoningExceedsEvidence(envelope) {

    if (envelope.reasoningExceedsEvidence === true) {
        return true;
    }

    const basis = getBasis(envelope);

    const evidenceCount =
        Number(
            basis?.evidenceCount ??
            envelope.evidenceCount ??
            0
        );

    const reasoningEvidenceCount =
        Number(
            envelope.reasoningEvidenceCount ??
            basis?.reasoningEvidenceCount ??
            0
        );

    return (
        reasoningEvidenceCount > evidenceCount
    );
}

function responsibilityExceedsReasoning(envelope) {

    if (envelope.responsibilityExceedsReasoning === true) {
        return true;
    }

    const basis = getBasis(envelope);

    const reasoningSupport =
        Number(
            envelope.reasoningSupportCount ??
            basis?.reasoningSupportCount ??
            0
        );

    const responsibilitySupport =
        Number(
            envelope.responsibilitySupportCount ??
            basis?.responsibilitySupportCount ??
            0
        );

    return (
        responsibilitySupport > 0 &&
        reasoningSupport > 0 &&
        responsibilitySupport > reasoningSupport
    );
}

function laterStageIntroducesCertainty(envelope) {

    if (
        envelope.laterStageIntroducedCertainty === true
    ) {
        return true;
    }

    if (
        envelope.generatorIncreasedCertainty === true
    ) {
        return true;
    }

    if (
        envelope.reconstructionIncreasedCertainty === true
    ) {
        return true;
    }

    if (
        envelope.previousVerificationState === "UNKNOWN" &&
        (
            envelope.verificationState === "VERIFIED" ||
            envelope.verificationState === "SUPPORTED"
        ) &&
        envelope.explicitVerificationTransition !== true
    ) {
        return true;
    }

    return false;
}

export default WALIndependentValidator;
