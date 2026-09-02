import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");
const WAL = path.join(ROOT, "protocol", "WAL");
const MANIFEST = path.join(
    WAL,
    "manifest",
    "WAL_PROTOCOL_v1.0.0.manifest.json"
);

const failures = [];

function fail(message) {
    failures.push(message);
}

function readUtf8(file) {
    return fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
}

function sha256(buffer) {
    return crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");
}

function git(args) {
    return execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8"
    }).trim();
}

function gitBytes(args) {
    return execFileSync("git", args, {
        cwd: ROOT
    });
}

const manifest = JSON.parse(readUtf8(MANIFEST));

const expectedCommit = git(["rev-parse", "wal-v1.0.0^{commit}"]);
const expectedTree = git(["rev-parse", "wal-v1.0.0^{tree}"]);

if (manifest.protocol !== "WAL") {
    fail(`Protocol mismatch: ${manifest.protocol}`);
}

if (manifest.version !== "1.0.0") {
    fail(`Version mismatch: ${manifest.version}`);
}

if (manifest.tag !== "wal-v1.0.0") {
    fail(`Tag mismatch: ${manifest.tag}`);
}

if (manifest.commit !== expectedCommit) {
    fail(`Commit mismatch`);
    fail(`  expected: ${expectedCommit}`);
    fail(`  actual:   ${manifest.commit}`);
}

if (manifest.tree !== expectedTree) {
    fail(`Tree mismatch`);
    fail(`  expected: ${expectedTree}`);
    fail(`  actual:   ${manifest.tree}`);
}

for (const [relative, entry] of Object.entries(manifest.artifacts)) {
    if (
        !entry ||
        typeof entry !== "object" ||
        typeof entry.path !== "string" ||
        typeof entry.sha256 !== "string"
    ) {
        fail(`Invalid manifest artifact entry: ${relative}`);
        continue;
    }

    if (entry.path !== relative) {
        fail(`Artifact path mismatch: ${relative}`);
        fail(`  manifest path: ${entry.path}`);
        fail(`  expected:      ${relative}`);
        continue;
    }

    const gitPath = `protocol/WAL/${entry.path}`;

    let content;

    try {
        content = gitBytes([
            "show",
            `${manifest.tag}:${gitPath}`
        ]);
    } catch {
        fail(`Missing artifact in tag: ${relative}`);
        continue;
    }

    const actualHash = sha256(content);

    if (actualHash !== entry.sha256) {
        fail(`SHA-256 mismatch: ${relative}`);
        fail(`  expected: ${entry.sha256}`);
        fail(`  actual:   ${actualHash}`);
    }
}

if (failures.length > 0) {
    console.error("WAL INTEGRITY GATE: FAIL");

    for (const failure of failures) {
        console.error(`- ${failure}`);
    }

    process.exit(1);
}

console.log("WAL INTEGRITY GATE: PASS");
console.log(`Protocol: ${manifest.protocol}`);
console.log(`Version:  ${manifest.version}`);
console.log(`Tag:      ${manifest.tag}`);
console.log(`Commit:   ${manifest.commit}`);
console.log(`Tree:     ${manifest.tree}`);
console.log(`Artifacts: ${Object.keys(manifest.artifacts).length}`);
