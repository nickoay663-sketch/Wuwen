import argparse
import json
from pathlib import Path
from wal_validator import validate_envelope

ROOT = Path(__file__).resolve().parents[1]


def run_vectors():
    manifest = json.loads(
        (ROOT / "golden-vectors" / "manifest.json").read_text(encoding="utf-8")
    )

    passed = 0

    for vector in manifest:
        envelope = json.loads(
            (ROOT / "golden-vectors" / vector["input"]).read_text(encoding="utf-8")
        )

        result = validate_envelope(envelope)

        ok = (
            result["status"] == vector["expectedStatus"]
            and result["passed"] == vector["expectedPassed"]
        )

        print(f'{vector["id"]}: {"PASS" if ok else "FAIL"}')

        if not ok:
            print(json.dumps(result, indent=2))
            return False

        passed += 1

    print(f"PYTHON GOLDEN VECTOR VALIDATION: PASS ({passed}/{len(manifest)})")
    return True


def run_self_hosting():
    print("=== WAL PYTHON SELF-HOSTING GATE ===")
    ok = run_vectors()

    if not ok:
        print("SELF-HOSTING GATE: FAIL")
        return False

    print("SELF-HOSTING GATE: PASS")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true")
    args = parser.parse_args()

    success = run_self_hosting() if args.test else run_vectors()
    raise SystemExit(0 if success else 1)
