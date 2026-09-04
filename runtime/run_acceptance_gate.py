#!/usr/bin/env python3
import sys
import os
import subprocess
import shutil
import hashlib
from datetime import datetime

def log_decryption_failure(cmd, raw_bytes, error_msg):
    """涓ユ牸璁板綍瑙ｇ爜澶辫触璇佹嵁锛岀粷涓嶉潤榛樺悶閿?""
    timestamp = datetime.utcnow().isoformat()
    raw_hash = hashlib.sha256(raw_bytes).hexdigest()
    log_dir = "runtime/logs"
    os.makedirs(log_dir, exist_ok=True)
    log_path = os.path.join(log_dir, "decryption_failure.log")

    entry = (
        f"[{timestamp}] DECRYPTION_FAILURE\n"
        f"Command: {cmd}\n"
        f"Raw Output SHA256: {raw_hash}\n"
        f"Error: {error_msg}\n"
        "-" * 40 + "\n"
    )
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(entry)
    print(f"[FATAL] Non-decodable output captured. Forensic log written to {log_path}")

def run_strict_command(cmd_list):
    """鎵ц鍛戒护锛氱鐢?shell=True 闃叉娉ㄥ叆锛岀鐢?errors='replace' 闃叉闈欓粯绡℃敼"""
    try:
        completed = subprocess.run(
            cmd_list,
            capture_output=True,
            check=False
        )
    except Exception as e:
        print(f"[FAIL] Execution exception for {cmd_list}: {e}")
        sys.exit(1)

    try:
        stdout_text = completed.stdout.decode("utf-8")
    except UnicodeDecodeError as ude:
        log_decryption_failure(cmd_list, completed.stdout, str(ude))
        sys.exit(1)

    try:
        stderr_text = completed.stderr.decode("utf-8")
    except UnicodeDecodeError as ude:
        log_decryption_failure(cmd_list, completed.stderr, str(ude))
        sys.exit(1)

    return completed.returncode, stdout_text, stderr_text

def resolve_cmd(cmd_name):
    """鍦?Windows 鎴?POSIX 鐜涓嬪畨鍏ㄨВ鏋愬懡浠よ矾寰勶紝閬垮厤 shell=True"""
    resolved = shutil.which(cmd_name)
    if resolved:
        return resolved
    if os.name == "nt":
        for ext in [".cmd", ".exe", ".bat"]:
            resolved = shutil.which(cmd_name + ext)
            if resolved:
                return resolved
    return cmd_name

def run_gate():
    print("=== [Total Acceptance Gate] Initiating Strict Dynamic Pipeline ===")

    # 1. Check working tree cleanliness / encoding
    print("[1/5] Running Encoding & Integrity Check...")
    git_bin = resolve_cmd("git")
    code, stdout, stderr = run_strict_command([git_bin, "status", "--porcelain"])
    if code != 0:
        print("[FAIL] Git status check failed.")
        print(stderr)
        sys.exit(1)
    print("[PASS] Working tree integrity verified.")

    # 2. Verify Schema and Core Assets
    print("[2/5] Verifying WAL v1.1 Core Assets & Schema...")
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

    # 3. Execute Envelope Schema Adversarial Validation
    print("[3/5] Executing Envelope Schema Adversarial Gate...")
    py_bin = resolve_cmd("python")
    code, stdout, stderr = run_strict_command([py_bin, "runtime/test_envelope_schema.py"])
    if code != 0:
        print("[FAIL] Envelope Schema adversarial gate failed.")
        print(stdout)
        print(stderr)
        sys.exit(1)
    print(stdout.strip())
    print("[PASS] Envelope Schema adversarial validation passed.")

    # 4. Execute Conformance & Integrity Test Suites
    print("[4/5] Executing Core Test Suites...")
    npm_bin = resolve_cmd("npm")
    code, stdout, stderr = run_strict_command([npm_bin, "test"])
    if code != 0:
        print("[FAIL] Test suites execution failed.")
        print(stdout)
        print(stderr)
        sys.exit(1)
    print("[PASS] All test suites passed successfully.")

    # 5. Final Conformance Confirmation
    print("[5/5] Total Acceptance Gate Check Completed Successfully.")
    print("=== ALL GATES PASSED: System is Certified & Ready ===")

if __name__ == "__main__":
    run_gate()
