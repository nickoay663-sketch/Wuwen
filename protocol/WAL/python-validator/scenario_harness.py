import sys
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "python-validator"))

from wal_validator import validate_envelope


def run_scenario(name, envelope, expected_status, expected_rules=None, original_expression=None):
    result = validate_envelope(
        envelope,
        original_expression=original_expression,
    )

    actual_rules = {
        item["rule"] for item in result["failedRules"]
    }

    status_ok = result["status"] == expected_status
    rules_ok = (
        expected_rules is None
        or set(expected_rules) == actual_rules
    )

    passed = status_ok and rules_ok

    print(f"[{name}]")
    print(f"  status: {result['status']}")
    print(f"  passed: {result['passed']}")
    print(f"  failedRules: {sorted(actual_rules)}")
    print(f"  scenario: {'PASS' if passed else 'FAIL'}")
    print()

    return passed


def base_envelope():
    return {
        "eventId": "scenario-001",
        "expression": "A test WAL expression",
        "identity": "scenario-test-identity",
        "timestamp": "2026-09-02T00:00:00Z",
        "verificationState": "UNKNOWN",
        "responsibilityState": "UNKNOWN",
        "propagationState": "REQUIRE_VERIFICATION",
        "runtimeVersion": "scenario",
        "contractVersion": "1.0",
        "evidence": [],
        "responsibility": None,
        "auditTrail": [],
        "signature": None,
    }


def main():
    scenarios = []

    baseline = base_envelope()
    scenarios.append(
        ("Baseline", baseline, "CONFORM", [])
    )

    structural_attack = deepcopy(baseline)
    del structural_attack["eventId"]
    scenarios.append(
        (
            "R00 structural contract violation",
            structural_attack,
            "NON_CONFORM",
            ["WAL-R00-01"],
        )
    )

    expression_attack = deepcopy(baseline)
    expression_attack["expression"] = "SUBSTITUTED"
    scenarios.append(
        (
            "R01 expression substitution attack",
            expression_attack,
            "NON_CONFORM",
            [
                "WAL-R01-01",
                "WAL-R01-02",
                "WAL-R01-03",
            ],
            "ORIGINAL",
        )
    )

    discovery_attack = deepcopy(baseline)
    discovery_attack["discoveryState"] = "DISCOVERED"
    discovery_attack["verificationState"] = "VERIFIED"
    discovery_attack["epistemicState"] = "CERTAIN"
    scenarios.append(
        (
            "R02 discovery to verified escalation attack",
            discovery_attack,
            "NON_CONFORM",
            [
                "WAL-R00-03",
                "WAL-R02-02",
                "WAL-R02-10",
            ],
        )
    )

    unverified_attack = deepcopy(baseline)
    unverified_attack["previousVerificationState"] = "UNVERIFIED"
    unverified_attack["verificationState"] = "VERIFIED"
    unverified_attack["epistemicState"] = "CERTAIN"
    scenarios.append(
        (
            "R02 unverified to verified escalation attack",
            unverified_attack,
            "NON_CONFORM",
            [
                "WAL-R00-03",
                "WAL-R02-11",
            ],
        )
    )

    unknown_true_attack = deepcopy(baseline)
    unknown_true_attack["verificationState"] = "UNKNOWN"
    unknown_true_attack["epistemicState"] = "TRUE"
    scenarios.append(
        (
            "R02 UNKNOWN to TRUE escalation attack",
            unknown_true_attack,
            "NON_CONFORM",
            ["WAL-R02-14"],
        )
    )

    unknown_allow_attack = deepcopy(baseline)
    unknown_allow_attack["propagationState"] = "ALLOW"
    scenarios.append(
        (
            "R03 UNKNOWN to ALLOW boundary attack",
            unknown_allow_attack,
            "NON_CONFORM",
            [
                "WAL-R00-08",
                "WAL-R03-05",
                "WAL-R03-06",
            ],
        )
    )

    reasoning_attack = deepcopy(baseline)
    reasoning_attack["reasoning"] = "unsupported reasoning"
    reasoning_attack["reasoningExceedsEvidence"] = True
    scenarios.append(
        (
            "R03 reasoning exceeds evidence attack",
            reasoning_attack,
            "NON_CONFORM",
            ["WAL-R03-02"],
        )
    )

    reconstruction_attack = deepcopy(baseline)
    reconstruction_attack["reconstructionIncreasedCertainty"] = True
    scenarios.append(
        (
            "R04 reconstruction certainty escalation attack",
            reconstruction_attack,
            "NON_CONFORM",
            [
                "WAL-R03-04",
                "WAL-R04-04",
            ],
        )
    )

    generator_attack = deepcopy(baseline)
    generator_attack["generatorIncreasedCertainty"] = True
    scenarios.append(
        (
            "R04 generator certainty escalation attack",
            generator_attack,
            "NON_CONFORM",
            [
                "WAL-R03-04",
                "WAL-R04-08",
            ],
        )
    )

    unsafe_reconstruction_attack = deepcopy(baseline)
    unsafe_reconstruction_attack["automaticReconstruction"] = True
    unsafe_reconstruction_attack["automaticReconstructionUnsafe"] = True
    unsafe_reconstruction_attack["verificationState"] = "VERIFIED"
    unsafe_reconstruction_attack["resolutionState"] = "RESOLVED"
    scenarios.append(
        (
            "R04 unsafe automatic reconstruction bypass attack",
            unsafe_reconstruction_attack,
            "NON_CONFORM",
            [
                "WAL-R00-03",
                "WAL-R04-11",
            ],
        )
    )

    results = [
        run_scenario(*scenario)
        for scenario in scenarios
    ]

    passed_count = sum(results)
    total_count = len(results)

    print(f"SCENARIO MATRIX: {passed_count}/{total_count}")

    if all(results):
        print("SCENARIO HARNESS: PASS")
        return 0

    print("SCENARIO HARNESS: FAIL")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
