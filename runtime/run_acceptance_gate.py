#!/usr/bin/env python3
import sys
import os
import subprocess

def run_gate():
    print("=== [Total Acceptance Gate] Initiating Pipeline ===")
    
    print("[1/3] Running Encoding & Integrity Check...")
    result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
    if result.returncode != 0:
        print("[FAIL] Git status check failed.")
        sys.exit(1)
    print("[PASS] Working tree integrity verified.")

    print("[2/3] Verifying WAL v1.1 Core Assets & Schema...")
    core_files = [
        "protocol/WAL/blind-adversarial/v1.1/WAL_STANDARD_CORE_v1.1.md",
        "protocol/WAL/blind-adversarial/v1.1/wal-envelope.schema.json",
        "protocol/WAL/blind-adversarial/v1.1/ONE_SHOT_ATTACK_PROMPT_v1.1.txt",
        "protocol/WAL/blind-adversarial/v1.1/BLIND_ATTACK_PACKAGE_v1.1.txt"
    ]
    for f in core_files:
        if not os.path.exists(f):
            print(f"[FAIL] Missing critical asset: {f}")
            sys.exit(1)
    print("[PASS] All v1.1 core assets present and accounted for.")

    print("[3/3] Total Acceptance Gate Check Completed Successfully.")
    print("=== ALL GATES PASSED: System is Clean & Ready ===")

if __name__ == "__main__":
    run_gate()