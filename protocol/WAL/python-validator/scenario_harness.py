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

    results = [
        run_scenario(*scenario)
        for scenario in scenarios
    ]

    if all(results):
        print("SCENARIO HARNESS: PASS")
        return 0

    print("SCENARIO HARNESS: FAIL")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
