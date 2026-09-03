import { execFileSync } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";

test("WAL Python Self-Hosting Gate", () => {
    const output = execFileSync(
        "python",
        ["python-validator/run_vectors.py", "--test"],
        {
            cwd: process.cwd(),
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"]
        }
    );

    console.log(output.trim());
    assert.match(output, /SELF-HOSTING GATE: PASS/);
});
