import json
from pathlib import Path

VERSION = "1.0"

RESPONSIBILITY_STATES = {
    "UNKNOWN",
    "UNESTABLISHED",
    "ESTABLISHED",
    "PARTIAL",
    "DISPUTED",
}

VERIFICATION_STATES = {
    "UNKNOWN",
    "UNVERIFIED",
    "DISCOVERED",
    "SUPPORTED",
    "VERIFIED",
    "CONTRADICTED",
}

PROPAGATION_STATES = {
    "ALLOW",
    "ALLOW_WITH_BOUNDARY",
    "REQUIRE_VERIFICATION",
    "BLOCK",
}

REQUIRED_FIELDS = [
    "eventId",
    "expression",
    "identity",
    "timestamp",
    "verificationState",
    "responsibilityState",
    "propagationState",
    "runtimeVersion",
    "contractVersion",
]


def validate_r01(envelope, original_expression=None, testimony=None, responsibility_event=None):
    checks = []

    checks.append({
        "rule": "WAL-R01-01",
        "passed": (
            original_expression is None
            or envelope.get("expression") == original_expression
        ),
    })

    original_input = None
    if isinstance(testimony, dict):
        original_input = testimony.get("originalInput")

    original_input_expression = None
    if isinstance(original_input, dict):
        original_input_expression = original_input.get("originalExpression")

    checks.append({
        "rule": "WAL-R01-02",
        "passed": (
            original_expression is None
            or (
                envelope.get("expression") == original_expression
                and (
                    testimony is None
                    or original_input_expression is None
                    or original_input_expression == original_expression
                )
            )
        ),
    })

    event_expression = None
    event_testimony = None

    if isinstance(responsibility_event, dict):
        event_expression = responsibility_event.get("expression")
        event_testimony = responsibility_event.get("testimony")

    event_original_expression = None
    if isinstance(event_testimony, dict):
        event_original_input = event_testimony.get("originalInput")
        if isinstance(event_original_input, dict):
            event_original_expression = event_original_input.get(
                "originalExpression"
            )

    checks.append({
        "rule": "WAL-R01-03",
        "passed": (
            original_expression is None
            or (
                responsibility_event is not None
                and event_expression == original_expression
                and (
                    event_testimony is None
                    or isinstance(event_testimony, str)
                    or event_original_expression == original_expression
                )
            )
        ),
    })

    definition = envelope.get("definition")
    checks.append({
        "rule": "WAL-R01-04",
        "passed": not (
            isinstance(definition, dict)
            and definition.get("syntheticMeaning") is True
        ),
    })

    language_system = envelope.get("languageSystem")
    checks.append({
        "rule": "WAL-R01-05",
        "passed": not (
            isinstance(language_system, dict)
            and language_system.get("runtimeOwned") is True
        ),
    })

    checks.append({
        "rule": "WAL-R01-06",
        "passed": not (
            isinstance(language_system, dict)
            and language_system.get("runtimeCreated") is True
        ),
    })

    checks.append({
        "rule": "WAL-R01-07",
        "passed": envelope.get("undefinedObjectsIntroduced") is not True,
    })

    checks.append({
        "rule": "WAL-R01-08",
        "passed": not (
            envelope.get("languageIdentification") is True
            and envelope.get("verificationState")
            in {"VERIFIED", "SUPPORTED"}
            and envelope.get("verificationBasis")
            == "LANGUAGE_IDENTIFICATION"
        ),
    })

    checks.append({
        "rule": "WAL-R01-09",
        "passed": envelope.get("semanticAnalysisUsedAsEvidence") is not True,
    })

    restated = envelope.get("restatedExpression")
    checks.append({
        "rule": "WAL-R01-10",
        "passed": (
            original_expression is None
            or restated is None
            or restated == original_expression
            or envelope.get("restatedExpressionPreservesClaim") is True
        ),
    })

    return checks



def validate_r00(envelope):
    checks = []

    missing_fields = [
        field for field in REQUIRED_FIELDS
        if field not in envelope
    ]

    verification_state_valid = (
        envelope.get("verificationState") in VERIFICATION_STATES
    )

    responsibility_state_valid = (
        envelope.get("responsibilityState")
        in RESPONSIBILITY_STATES
    )

    propagation_state_valid = (
        envelope.get("propagationState")
        in PROPAGATION_STATES
    )

    checks.append({
        "rule": "WAL-R00-01",
        "passed": (
            len(missing_fields) == 0
            and verification_state_valid
            and responsibility_state_valid
            and propagation_state_valid
        ),
    })

    responsibility = envelope.get("responsibility")
    evidence = envelope.get("evidence")

    checks.append({
        "rule": "WAL-R00-02",
        "passed": responsibility_within_evidence(envelope),
    })

    checks.append({
        "rule": "WAL-R00-03",
        "passed": not (
            is_high_certainty(envelope)
            and not has_evidence(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R00-04",
        "passed": not contains_manufactured_evidence(envelope),
    })

    checks.append({
        "rule": "WAL-R00-05",
        "passed": not contains_manufactured_knowledge(envelope),
    })

    checks.append({
        "rule": "WAL-R00-06",
        "passed": not (
            envelope.get("runtimeState") == "RuntimeClosed"
            and envelope.get("verificationState") == "VERIFIED"
            and envelope.get("factualVerification") is False
        ),
    })

    forbidden = {
        "semanticObject",
        "engineRegistry",
        "engines",
        "runtimeContext",
        "metadata",
        "trace",
        "nextRuntimeState",
        "runtimeTrace",
    }

    checks.append({
        "rule": "WAL-R00-07",
        "passed": not any(
            field in envelope for field in forbidden
        ),
    })

    checks.append({
        "rule": "WAL-R00-08",
        "passed": (
            envelope.get("propagationState") != "ALLOW"
            or envelope.get("verificationState")
            in {"SUPPORTED", "VERIFIED"}
        ),
    })

    return checks


def has_evidence(envelope):
    evidence = envelope.get("evidence")
    return isinstance(evidence, list) and len(evidence) > 0


def is_high_certainty(envelope):
    return envelope.get("verificationState") in {
        "SUPPORTED",
        "VERIFIED",
    }


def responsibility_within_evidence(envelope):
    return not (
        envelope.get("responsibilityExceedsEvidence") is True
    )


def contains_manufactured_evidence(envelope):
    if envelope.get("manufacturedEvidence") is True:
        return True
    if envelope.get("reconstructionManufacturedEvidence") is True:
        return True

    evidence = envelope.get("evidence")
    if isinstance(evidence, list):
        for item in evidence:
            if isinstance(item, dict) and item.get("manufactured") is True:
                return True
            if isinstance(item, str) and "MANUFACTURED_PLACEHOLDER" in item:
                return True

    return False


def contains_manufactured_knowledge(envelope):
    if envelope.get("manufacturedKnowledge") is True:
        return True
    if envelope.get("reconstructionManufacturedKnowledge") is True:
        return True
    if envelope.get("knowledgeManufactured") is True:
        return True

    try:
        text = __import__("json").dumps(envelope)
        return "SYNTHETIC_FABRICATION_MARKER" in text
    except Exception:
        return False


def get_responsibility(envelope):
    return envelope.get("responsibility") or None


def get_basis(envelope):
    responsibility = get_responsibility(envelope)
    return (responsibility.get("basis") if isinstance(responsibility, dict) else None) or None


def has_definition(envelope):
    basis = get_basis(envelope)
    return bool(
        (basis.get("definition") if isinstance(basis, dict) else None)
        or envelope.get("definition")
    )


def has_independent_evidence(envelope):
    basis = get_basis(envelope)

    verified_evidence_count = (
        basis.get("verifiedEvidenceCount", envelope.get("verifiedEvidenceCount", 0))
        if isinstance(basis, dict)
        else envelope.get("verifiedEvidenceCount", 0)
    )

    evidence_count = (
        basis.get("evidenceCount", envelope.get("evidenceCount", 0))
        if isinstance(basis, dict)
        else envelope.get("evidenceCount", 0)
    )

    try:
        verified_evidence_count = float(verified_evidence_count)
    except (TypeError, ValueError):
        verified_evidence_count = 0

    try:
        evidence_count = float(evidence_count)
    except (TypeError, ValueError):
        evidence_count = 0

    return verified_evidence_count > 0 and evidence_count > 0


def has_explicit_verification(envelope):
    basis = get_basis(envelope)

    if isinstance(basis, dict):
        verification_status = basis.get(
            "verificationStatus",
            envelope.get("verificationStatus"),
        )
    else:
        verification_status = envelope.get("verificationStatus")

    return verification_status in {"VERIFIED", "SUPPORTED"}


def has_explicit_correspondence(envelope):
    responsibility = get_responsibility(envelope)
    limitations = (
        responsibility.get("limitations")
        if isinstance(responsibility, dict)
        else None
    )

    correspondence = envelope.get("correspondence")

    if correspondence is None and isinstance(responsibility, dict):
        correspondence = responsibility.get("correspondence")

    if correspondence is None and isinstance(limitations, dict):
        correspondence = limitations.get("correspondence")

    if correspondence is True:
        return True

    if isinstance(correspondence, dict):
        return (
            correspondence.get("status") == "matched"
            or correspondence.get("matched") is True
            or correspondence.get("corresponds") is True
        )

    return False


def has_supported_basis(envelope):
    return (
        has_definition(envelope)
        and has_independent_evidence(envelope)
        and has_explicit_verification(envelope)
        and has_explicit_correspondence(envelope)
    )


def same_search_and_evidence(search_results, evidence):
    if len(search_results) != len(evidence):
        return False

    return all(
        json.dumps(search, ensure_ascii=False, separators=(",", ":"))
        == json.dumps(evidence[index], ensure_ascii=False, separators=(",", ":"))
        for index, search in enumerate(search_results)
    )


def validate_r02(envelope):
    checks = []

    search_results = envelope.get("searchResults")
    evidence = envelope.get("evidence")

    checks.append({
        "rule": "WAL-R02-01",
        "passed": not (
            isinstance(search_results, list)
            and len(search_results) > 0
            and isinstance(evidence, list)
            and len(evidence) == len(search_results)
            and same_search_and_evidence(search_results, evidence)
        ),
    })

    checks.append({
        "rule": "WAL-R02-02",
        "passed": not (
            envelope.get("discoveryState") == "DISCOVERED"
            and envelope.get("verificationState") == "VERIFIED"
        ),
    })

    checks.append({
        "rule": "WAL-R02-03",
        "passed": not (
            envelope.get("sourceExists") is True
            and envelope.get("evidenceDerivedFromExistence") is True
        ),
    })

    checks.append({
        "rule": "WAL-R02-04",
        "passed": not (
            envelope.get("sourceExists") is True
            and envelope.get("correspondence") is True
            and envelope.get("correspondenceBasis") == "SOURCE_EXISTS"
        ),
    })

    checks.append({
        "rule": "WAL-R02-05",
        "passed": (
            envelope.get("verificationState") != "SUPPORTED"
            or has_supported_basis(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R02-06",
        "passed": (
            envelope.get("verificationState") != "SUPPORTED"
            or has_definition(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R02-07",
        "passed": (
            envelope.get("verificationState") != "SUPPORTED"
            or has_independent_evidence(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R02-08",
        "passed": (
            envelope.get("verificationState") != "SUPPORTED"
            or has_explicit_verification(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R02-09",
        "passed": (
            envelope.get("verificationState") != "SUPPORTED"
            or has_explicit_correspondence(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R02-10",
        "passed": not (
            envelope.get("discoveryState") == "DISCOVERED"
            and envelope.get("verificationState") == "VERIFIED"
        ),
    })

    checks.append({
        "rule": "WAL-R02-11",
        "passed": not (
            envelope.get("previousVerificationState") == "UNVERIFIED"
            and envelope.get("verificationState") == "VERIFIED"
        ),
    })

    checks.append({
        "rule": "WAL-R02-12",
        "passed": (
            envelope.get("verificationState") != "SUPPORTED"
            or has_supported_basis(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R02-13",
        "passed": not (
            envelope.get("epistemicState") == "VERIFIED_BUT_NOT_LINKED"
            and envelope.get("verificationState") == "SUPPORTED"
        ),
    })

    checks.append({
        "rule": "WAL-R02-14",
        "passed": not (
            envelope.get("verificationState") == "UNKNOWN"
            and envelope.get("epistemicState") == "TRUE"
        ),
    })

    checks.append({
        "rule": "WAL-R02-15",
        "passed": not (
            envelope.get("verificationState") == "UNKNOWN"
            and envelope.get("epistemicState") == "FALSE"
        ),
    })

    return checks



def has_reasoning(envelope):
    return (
        "reasoning" in envelope
        and envelope.get("reasoning") is not None
    )



def reasoning_exceeds_evidence(envelope):
    if envelope.get("reasoningExceedsEvidence") is True:
        return True

    basis = get_basis(envelope)

    if isinstance(basis, dict):
        evidence_count = basis.get(
            "evidenceCount",
            envelope.get("evidenceCount", 0),
        )
    else:
        evidence_count = envelope.get("evidenceCount", 0)

    if isinstance(basis, dict):
        reasoning_evidence_count = envelope.get(
            "reasoningEvidenceCount",
            basis.get("reasoningEvidenceCount", 0),
        )
    else:
        reasoning_evidence_count = envelope.get("reasoningEvidenceCount", 0)

    try:
        evidence_count = float(evidence_count)
    except (TypeError, ValueError):
        evidence_count = 0

    try:
        reasoning_evidence_count = float(reasoning_evidence_count)
    except (TypeError, ValueError):
        reasoning_evidence_count = 0

    return reasoning_evidence_count > evidence_count


def responsibility_exceeds_reasoning(envelope):
    if envelope.get("responsibilityExceedsReasoning") is True:
        return True

    basis = get_basis(envelope)

    if isinstance(basis, dict):
        reasoning_support = envelope.get(
            "reasoningSupportCount",
            basis.get("reasoningSupportCount", 0),
        )
        responsibility_support = envelope.get(
            "responsibilitySupportCount",
            basis.get("responsibilitySupportCount", 0),
        )
    else:
        reasoning_support = envelope.get("reasoningSupportCount", 0)
        responsibility_support = envelope.get("responsibilitySupportCount", 0)

    try:
        reasoning_support = float(reasoning_support)
    except (TypeError, ValueError):
        reasoning_support = 0

    try:
        responsibility_support = float(responsibility_support)
    except (TypeError, ValueError):
        responsibility_support = 0

    return (
        responsibility_support > 0
        and reasoning_support > 0
        and responsibility_support > reasoning_support
    )


def later_stage_introduces_certainty(envelope):
    if envelope.get("laterStageIntroducedCertainty") is True:
        return True

    if envelope.get("generatorIncreasedCertainty") is True:
        return True

    if envelope.get("reconstructionIncreasedCertainty") is True:
        return True

    return (
        envelope.get("previousVerificationState") == "UNKNOWN"
        and envelope.get("verificationState") in {"VERIFIED", "SUPPORTED"}
        and envelope.get("explicitVerificationTransition") is not True
    )


def validate_r03(envelope):
    checks = []

    checks.append({
        "rule": "WAL-R03-01",
        "passed": responsibility_within_evidence(envelope),
    })

    checks.append({
        "rule": "WAL-R03-02",
        "passed": not (
            has_reasoning(envelope)
            and reasoning_exceeds_evidence(envelope)
        ),
    })

    checks.append({
        "rule": "WAL-R03-03",
        "passed": not responsibility_exceeds_reasoning(envelope),
    })

    checks.append({
        "rule": "WAL-R03-04",
        "passed": not later_stage_introduces_certainty(envelope),
    })

    checks.append({
        "rule": "WAL-R03-05",
        "passed": (
            envelope.get("verificationState") != "UNKNOWN"
            or envelope.get("propagationState") == "REQUIRE_VERIFICATION"
        ),
    })

    checks.append({
        "rule": "WAL-R03-06",
        "passed": not (
            envelope.get("verificationState") == "UNKNOWN"
            and envelope.get("propagationState") == "ALLOW"
        ),
    })

    checks.append({
        "rule": "WAL-R03-07",
        "passed": (
            isinstance(envelope.get("verificationState"), str)
            and not (
                envelope.get("knownState") == envelope.get("unknownState")
                and "knownState" in envelope
            )
        ),
    })

    checks.append({
        "rule": "WAL-R03-08",
        "passed": (
            "propagationState" in envelope
            and not (
                envelope.get("correspondence") is True
                and envelope.get("nonCorrespondence") is True
            )
        ),
    })

    responsibility = envelope.get("responsibility")

    checks.append({
        "rule": "WAL-R03-09",
        "passed": (
            responsibility is None
            or isinstance(responsibility, dict)
        ),
    })

    return checks



def validate_r04(envelope):
    checks = []

    checks.append({
        "rule": "WAL-R04-01",
        "passed": envelope.get("reconstructionPurpose") not in {
            "PUNISHMENT",
            "CENSORSHIP",
        },
    })

    checks.append({
        "rule": "WAL-R04-02",
        "passed": not (
            envelope.get("reconstructionPreservesIntent") is False
            and envelope.get("reconstructionIntentRequired") is True
        ),
    })

    checks.append({
        "rule": "WAL-R04-03",
        "passed": envelope.get("reconstructionExceededResponsibility") is not True,
    })

    checks.append({
        "rule": "WAL-R04-04",
        "passed": envelope.get("reconstructionIncreasedCertainty") is not True,
    })

    checks.append({
        "rule": "WAL-R04-05",
        "passed": not (
            envelope.get("unknownPortionsPreserved") is False
            and envelope.get("unknownPortionsPresent") is True
        ),
    })

    checks.append({
        "rule": "WAL-R04-06",
        "passed": envelope.get("reconstructionManufacturedEvidence") is not True,
    })

    checks.append({
        "rule": "WAL-R04-07",
        "passed": envelope.get("reconstructionManufacturedKnowledge") is not True,
    })

    checks.append({
        "rule": "WAL-R04-08",
        "passed": envelope.get("generatorIncreasedCertainty") is not True,
    })

    checks.append({
        "rule": "WAL-R04-09",
        "passed": envelope.get("generatorManufacturedFacts") is not True,
    })

    checks.append({
        "rule": "WAL-R04-10",
        "passed": not (
            envelope.get("automaticReconstruction") is True
            and (
                envelope.get("reconstructionChangedResponsibilityObject") is True
                or envelope.get("reconstructionChangedFactualRelationship") is True
                or envelope.get("reconstructionChangedEvidenceRelationship") is True
                or envelope.get("reconstructionChangedEpistemicState") is True
            )
        ),
    })

    checks.append({
        "rule": "WAL-R04-11",
        "passed": not (
            envelope.get("automaticReconstructionUnsafe") is True
            and envelope.get("verificationState") != "UNKNOWN"
            and envelope.get("resolutionState") != "UNRESOLVED"
        ),
    })

    checks.append({
        "rule": "WAL-R04-12",
        "passed": envelope.get("publicationJustifiesBoundaryViolation") is not True,
    })

    return checks


def validate_envelope(
    envelope,
    original_expression=None,
    testimony=None,
    responsibility_event=None,
):
    checks = validate_r00(envelope)

    checks.extend(validate_r01(
        envelope,
        original_expression,
        testimony,
        responsibility_event,
    ))

    checks.extend(validate_r02(envelope))
    checks.extend(validate_r03(envelope))
    checks.extend(validate_r04(envelope))

    return result(checks)


def result(checks):
    failed_rules = [
        {"rule": check["rule"]}
        for check in checks
        if check["passed"] is not True
    ]

    return {
        "status": "CONFORM" if not failed_rules else "NON_CONFORM",
        "passed": not failed_rules,
        "totalRulesChecked": len(checks),
        "passedRules": sum(
            1 for check in checks if check["passed"] is True
        ),
        "failedRules": failed_rules,
        "checks": checks,
    }


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


if __name__ == "__main__":
    import sys

    envelope = load_json(sys.argv[1])
    print(json.dumps(validate_envelope(envelope), indent=2))
