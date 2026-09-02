import json
from pathlib import Path
from wal_validator import validate_envelope

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads(
    (ROOT / "golden-vectors" / "manifest.json").read_text(encoding="utf-8")
)

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
        raise SystemExit(1)

print("PYTHON GOLDEN VECTOR VALIDATION: PASS")
