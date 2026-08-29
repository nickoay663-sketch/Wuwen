import MWALContract from "./MWALContract.js";

class MWALIndependentValidator {

    constructor() {

        this.name =
            "MWAL Independent Validator";

        this.version =
            "1.0";

        this.standard =
            "MWAL Standard Core v1.0";

        this.ruleInventory =
            "MWAL Rule Inventory v1.0";

    }


    validateEnvelope(envelope = {}, originalExpression = undefined, testimony = undefined, responsibilityEvent = undefined) {

        const contractValidation =
            MWALContract.validate(
                envelope
            );

        const checks = [];

        checks.push({
    rule: "MWAL-R01-01",
    name: "Original expression identity is preserved",
    passed:
        originalExpression === undefined ||
        envelope.expression === originalExpression
});

checks.push({
    rule: "MWAL-R01-02",
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
    rule: "MWAL-R01-03",
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

        /*
         * =====================================================
         * Cross-Core / Structural
         * =====================================================
         */

        checks.push({
            rule: "MWAL-R00-01",
            name: "MWAL contract structural validity",
            passed:
                contractValidation.valid === true
        });

        checks.push({
            rule: "MWAL-R00-06",
            name: "Runtime closure does not imply factual verification",
            passed:
                !(
                    envelope.runtimeState === "RuntimeClosed" &&
                    envelope.verificationState === "VERIFIED" &&
                    envelope.factualVerification === false
                )
        });

        checks.push({
            rule: "MWAL-R00-08",
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
         * Runtime Boundary
         * =====================================================
         */

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

        const leakedRuntimeFields =
            forbiddenRuntimeFields.filter(
                field =>
                    Object.prototype.hasOwnProperty.call(
                        envelope,
                        field
                    )
            );





        checks.push({
            rule: "MWAL-R00-07",
            name: "Runtime internals must not cross the MWAL boundary",
            passed:
                leakedRuntimeFields.length === 0
        });

/*
         * =====================================================
         * CORE-02 Information / Evidence
         * =====================================================
         */

        checks.push({
            rule: "MWAL-R02-01",
            name: "Search results are not automatically evidence",
            passed:
                !(
                    Array.isArray(envelope.searchResults) &&
                    envelope.searchResults.length > 0 &&
                    Array.isArray(envelope.evidence) &&
                    envelope.evidence.length ===
                        envelope.searchResults.length
                )
        });

        checks.push({
            rule: "MWAL-R02-00",
            name: "VERIFIED requires an explicit Runtime Verification Record",
            passed:
                envelope.verificationState !== "VERIFIED" ||
                (
                    envelope.runtimeVerificationRecord === true &&
                    envelope.verificationAction &&
                    typeof envelope.verificationAction === "object"
                )
        });

        checks.push({
            rule: "MWAL-R02-02",
            name: "Discovered information remains distinguishable from verified information",
            passed:
                !(
                    envelope.verificationState === "VERIFIED" &&
                    envelope.discoveryState === "DISCOVERED"
                )
        });

        checks.push({
            rule: "MWAL-R02-05",
            name: "Evidence does not become support without required conditions",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasSupportedBasis(envelope)
        });

        checks.push({
            rule: "MWAL-R02-06",
            name: "SUPPORTED requires a definition",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasDefinition(envelope)
        });

        checks.push({
            rule: "MWAL-R02-07",
            name: "SUPPORTED requires independent evidence",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasIndependentEvidence(envelope)
        });

        checks.push({
            rule: "MWAL-R02-08",
            name: "SUPPORTED requires explicit verification",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasExplicitVerification(envelope)
        });

        checks.push({
            rule: "MWAL-R02-09",
            name: "SUPPORTED requires explicit correspondence",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasExplicitCorrespondence(envelope)
        });

        checks.push({
            rule: "MWAL-R02-10",
            name: "DISCOVERED must not automatically promote to VERIFIED",
            passed:
                !(
                    envelope.discoveryState === "DISCOVERED" &&
                    envelope.verificationState === "VERIFIED"
                )
        });

        checks.push({
            rule: "MWAL-R02-11",
            name: "UNVERIFIED must not automatically promote to VERIFIED",
            passed:
                !(
                    envelope.previousVerificationState === "UNVERIFIED" &&
                    envelope.verificationState === "VERIFIED"
                )
        });

        checks.push({
            rule: "MWAL-R02-12",
            name: "VERIFIED must not automatically promote to SUPPORTED",
            passed:
                envelope.verificationState !== "SUPPORTED" ||
                hasSupportedBasis(envelope)
        });

        checks.push({
            rule: "MWAL-R02-13",
            name: "VERIFIED_BUT_NOT_LINKED must not automatically promote to SUPPORTED",
            passed:
                !(
                    envelope.epistemicState ===
                        "VERIFIED_BUT_NOT_LINKED" &&
                    envelope.verificationState ===
                        "SUPPORTED"
                )
        });

        checks.push({
            rule: "MWAL-R02-14",
            name: "UNKNOWN must not become TRUE",
            passed:
                !(
                    envelope.verificationState === "UNKNOWN" &&
                    envelope.epistemicState === "TRUE"
                )
        });

        checks.push({
            rule: "MWAL-R02-15",
            name: "UNKNOWN must not become FALSE",
            passed:
                !(
                    envelope.verificationState === "UNKNOWN" &&
                    envelope.epistemicState === "FALSE"
                )
        });


        /*
         * =====================================================
         * CORE-03 Epistemic / Responsibility Boundary
         * =====================================================
         */

        checks.push({
            rule: "MWAL-R03-01",
            name: "Responsibility does not exceed evidence and correspondence",
            passed:
                responsibilityWithinEvidence(envelope)
        });

        checks.push({
            rule: "MWAL-R03-05",
            name: "UNKNOWN remains valid",
            passed:
                envelope.verificationState !== "UNKNOWN" ||
                envelope.propagationState ===
                    "REQUIRE_VERIFICATION"
        });

        checks.push({
            rule: "MWAL-R03-06",
            name: "UNKNOWN is not converted merely to satisfy output requirements",
            passed:
                !(
                    envelope.verificationState === "UNKNOWN" &&
                    envelope.propagationState === "ALLOW"
                )
        });

        checks.push({
            rule: "MWAL-R03-07",
            name: "Epistemic state remains explicit",
            passed:
                typeof envelope.verificationState ===
                    "string"
        });

        checks.push({
            rule: "MWAL-R03-08",
            name: "Correspondence boundary remains explicit",
            passed:
                envelope.propagationState !== undefined
        });

        checks.push({
            rule: "MWAL-R03-09",
            name: "Responsibility boundary is exposed",
            passed:
                envelope.responsibility === null ||
                typeof envelope.responsibility === "object"
        });


        /*
         * =====================================================
         * CORE-04 Reconstruction / Generator Boundary
         * =====================================================
         */

        checks.push({
            rule: "MWAL-R04-06",
            name: "Reconstruction does not manufacture evidence",
            passed:
                !(
                    envelope.reconstructionManufacturedEvidence === true
                )
        });

        checks.push({
            rule: "MWAL-R04-07",
            name: "Reconstruction does not manufacture knowledge",
            passed:
                !(
                    envelope.reconstructionManufacturedKnowledge === true
                )
        });

        checks.push({
            rule: "MWAL-R04-08",
            name: "Generator does not increase certainty",
            passed:
                !(
                    envelope.generatorIncreasedCertainty === true
                )
        });

        checks.push({
            rule: "MWAL-R04-09",
            name: "Generator does not manufacture facts",
            passed:
                !(
                    envelope.generatorManufacturedFacts === true
                )
        });


        /*
         * =====================================================
         * Final Result
         * =====================================================
         */

        const failedRules =
            checks.filter(
                check =>
                    check.passed !== true
            );

        return {

            validator:
                this.name,

            validatorVersion:
                this.version,

            standard:
                this.standard,

            ruleInventory:
                this.ruleInventory,

            passed:
                failedRules.length === 0,

            status:
                failedRules.length === 0
                    ? "CONFORM"
                    : "NON_CONFORM",

            totalRulesChecked:
                checks.length,

            passedRules:
                checks.filter(
                    check =>
                        check.passed === true
                ).length,

            failedRules,

            checks

        };

    }

}


/*
 * =============================================================
 * Independent Evidence Predicates
 * =============================================================
 *
 * These predicates inspect observable envelope structure only.
 * They do not call Runtime Engines and do not infer truth.
 */

function getResponsibility(
    envelope
) {

    return (
        envelope?.responsibility &&
        typeof envelope.responsibility === "object"
            ? envelope.responsibility
            : null
    );

}


function getBasis(
    envelope
) {

    return getResponsibility(
        envelope
    )?.basis || null;

}


function getLimitations(
    envelope
) {

    return getResponsibility(
        envelope
    )?.limitations || null;

}


function hasDefinition(
    envelope
) {

    const basis =
        getBasis(envelope);

    return Boolean(
        basis?.definition ||
        envelope.definition
    );

}


function hasIndependentEvidence(
    envelope
) {

    const basis =
        getBasis(envelope);

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


function hasExplicitVerification(
    envelope
) {

    const basis =
        getBasis(envelope);

    const verificationStatus =
        basis?.verificationStatus ??
        envelope.verificationStatus ??
        null;

    return (
        verificationStatus === "VERIFIED" ||
        verificationStatus === "SUPPORTED"
    );

}


function hasExplicitCorrespondence(
    envelope
) {

    const responsibility =
        getResponsibility(envelope);

    const limitations =
        getLimitations(envelope);

    const correspondence =
        envelope.correspondence ??
        responsibility?.correspondence ??
        limitations?.correspondence ??
        null;

    if (
        correspondence === true
    ) {
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


function hasSupportedBasis(
    envelope
) {

    return (
        hasDefinition(envelope) &&
        hasIndependentEvidence(envelope) &&
        hasExplicitVerification(envelope) &&
        hasExplicitCorrespondence(envelope)
    );

}


function responsibilityWithinEvidence(
    envelope
) {

    if (
        envelope.responsibilityState !==
            "ESTABLISHED"
    ) {
        return true;
    }

    const responsibility =
        getResponsibility(envelope);

    if (!responsibility) {
        return false;
    }

    const basis =
        responsibility.basis || {};

    const verifiedEvidenceCount =
        Number(
            basis.verifiedEvidenceCount ??
            0
        );

    const evidenceCount =
        Number(
            basis.evidenceCount ??
            0
        );

    const supported =
        basis.supported === true;

    const epistemicState =
        basis.epistemicState ??
        envelope.verificationState;

    const boundaryStatus =
        responsibility.limitations
            ?.responsibilityBoundary
            ?.status;

    if (
        boundaryStatus === "exceeded"
    ) {
        return false;
    }

    if (
        verifiedEvidenceCount <= 0 ||
        evidenceCount <= 0
    ) {
        return false;
    }

    if (
        supported !== true
    ) {
        return false;
    }

    if (
        epistemicState !== "SUPPORTED" &&
        envelope.verificationState !== "SUPPORTED"
    ) {
        return false;
    }

    return true;

}


export default MWALIndependentValidator;