import json
import os
import sys
from jsonschema import validate, ValidationError, Draft7Validator

def run_schema_tests():
    schema_path = "protocol/WAL/blind-adversarial/v1.1/wal-envelope.schema.json"
    if not os.path.exists(schema_path):
        print(f"[FAIL] Schema not found at {schema_path}")
        sys.exit(1)

    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)

    print("=== [Schema Gate] Loading wal-envelope.schema.json ===")

    # 鎸夌収鐪熷疄鐨?wal-envelope.schema.json 缁撴瀯鏋勯€犳祴璇曠敤渚嬬煩闃?    test_cases = [
        {
            "name": "Valid Baseline Envelope",
            "data": {
                "eventId": "evt-001",
                "expression": "eval(x)",
                "identity": "node-agent-01",
                "timestamp": "2026-09-04",
                "verificationState": "verified",
                "responsibilityState": "accountable",
                "propagationState": "propagated",
                "runtimeVersion": "v1.1",
                "contractVersion": "v1.1"
            },
            "expected": "ACCEPT"
        },
        {
            "name": "Missing Required Field (eventId)",
            "data": {
                "expression": "eval(x)",
                "identity": "node-agent-01",
                "timestamp": "2026-09-04",
                "verificationState": "verified",
                "responsibilityState": "accountable",
                "propagationState": "propagated",
                "runtimeVersion": "v1.1",
                "contractVersion": "v1.1"
            },
            "expected": "REJECT"
        },
        {
            "name": "Field Type Tampering (eventId as integer instead of string)",
            "data": {
                "eventId": 12345,
                "expression": "eval(x)",
                "identity": "node-agent-01",
                "timestamp": "2026-09-04",
                "verificationState": "verified",
                "responsibilityState": "accountable",
                "propagationState": "propagated",
                "runtimeVersion": "v1.1",
                "contractVersion": "v1.1"
            },
            "expected": "REJECT"
        },
        {
            "name": "Prohibited Field Injection (engineRegistry as string instead of object/etc if restricted)",
            "data": {
                "eventId": "evt-004",
                "expression": "eval(x)",
                "identity": "node-agent-01",
                "timestamp": "2026-09-04",
                "verificationState": "verified",
                "responsibilityState": "accountable",
                "propagationState": "propagated",
                "runtimeVersion": "v1.1",
                "contractVersion": "v1.1",
                "engineRegistry": 123  # 搴旇鏄?string锛岃繖閲屼紶 int 瑙﹀彂绫诲瀷鎷掔粷
            },
            "expected": "REJECT"
        }
    ]

    validator = Draft7Validator(schema)
    failed_count = 0

    for idx, case in enumerate(test_cases, 1):
        errors = list(validator.iter_errors(case["data"]))
        is_valid = len(errors) == 0
        actual = "ACCEPT" if is_valid else "REJECT"

        if actual == case["expected"]:
            print(f"[PASS] Case {idx}: {case['name']} -> Expected {case['expected']}, Got {actual}")
        else:
            print(f"[FAIL] Case {idx}: {case['name']} -> Expected {case['expected']}, Got {actual}")
            if errors:
                for err in errors:
                    print(f"       Reason: {err.message}")
            failed_count += 1

    if failed_count > 0:
        print(f"\n[FAIL] Schema Gate validation failed {failed_count} test(s).")
        sys.exit(1)
    else:
        print("\n[PASS] All Schema Gate adversarial test cases passed successfully.")

if __name__ == "__main__":
    run_schema_tests()
