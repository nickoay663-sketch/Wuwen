import { execFileSync } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const walRoot = resolve(testDir, "..");
const pythonValidatorDir = resolve(walRoot, "python-validator");
const pythonRunner = resolve(pythonValidatorDir, "run_vectors.py");

test("WAL Python Self-Hosting Gate", () => {
    const output = execFileSync(
        "python",
        [pythonRunner, "--test"],
        {
            cwd: pythonValidatorDir,
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"]
        }
    );

    console.log(output.trim());
    assert.match(output, /SELF-HOSTING GATE: PASS/);
});