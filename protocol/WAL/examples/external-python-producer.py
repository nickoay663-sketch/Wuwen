import json
from datetime import date

envelope = {
    "eventId": "python-clean-room-001",
    "expression": "External Python WAL producer test",
    "identity": "external-python",
    "timestamp": str(date.today()),
    "verificationState": "UNKNOWN",
    "responsibilityState": "BOUNDED",
    "propagationState": "NONE",
    "runtimeVersion": "external-python",
    "contractVersion": "WAL-1.0"
}

print(json.dumps(envelope, indent=2))
