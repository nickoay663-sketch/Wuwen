#!/usr/bin/env python3
import sys
import os
import subprocess

def run_gate():
    print("=== [Total Acceptance Gate] Initiating Dynamic Pipeline ===")
    
    # 1. Check working tree cleanliness / encoding
    print("[1/4] Running Encoding & Integrity Check...")
    result = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, encoding="utf-8", errors="replace", shell=True)
    if result.returncode != 0:
        print("[FAIL] Git status check failed.")
        sys.exit(1)
    print("[PASS] Working tree integrity verified.")

    # 2. Verify Schema and Core Assets
    print("[2/4] Verifying WAL v1.1 Core Assets & Schema...")
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

    # 3. Execute Conformance & Integrity Test Suites
    print("[3/4] Executing Core Test Suites...")
    test_res = subprocess.run("npm test", capture_output=True, text=True, encoding="utf-8", errors="replace", shell=True)
    if test_res.returncode != 0:
        print("[FAIL] Test suites execution failed.")
        print(test_res.stdout)
        print(test_res.stderr)
        sys.exit(1)
    print("[PASS] All test suites passed successfully.")

    # 4. Final Conformance Confirmation
    print("[4/4] Total Acceptance Gate Check Completed Successfully.")
    print("=== ALL GATES PASSED: System is Certified & Ready ===")

if __name__ == "__main__":
    run_gate()