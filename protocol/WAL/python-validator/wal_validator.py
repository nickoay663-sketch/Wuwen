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


def validate_envelope(envelope):
    failures = []

    if not isinstance(envelope, dict):
        failures.append("WAL-R00-01")
        return result(failures)

    for field in REQUIRED_FIELDS:
        if field not in envelope:
            failures.append("WAL-R00-01")

    if envelope.get("verificationState") not in VERIFICATION_STATES:
        failures.append("WAL-R00-01")

    if envelope.get("responsibilityState") not in RESPONSIBILITY_STATES:
        failures.append("WAL-R00-01")

    if envelope.get("propagationState") not in PROPAGATION_STATES:
        failures.append("WAL-R00-01")

    return result(failures)


def result(failures):
    failures = list(dict.fromkeys(failures))
    passed = len(failures) == 0

    return {
        "status": "CONFORM" if passed else "NON_CONFORM",
        "passed": passed,
        "totalRulesChecked": 1,
        "passedRules": 1 if passed else 0,
        "failedRules": [
            {"rule": rule}
            for rule in failures
        ],
    }


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


if __name__ == "__main__":
    import sys

    envelope = load_json(sys.argv[1])
    print(json.dumps(validate_envelope(envelope), indent=2))
