import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");
const WAL = path.join(ROOT, "protocol", "WAL");
const MANIFEST = path.join(WAL, "manifest", "WAL_PROTOCOL_v1.0.0.manifest.json");

const failures = [];

function fail(message) {
    failures.push(message);
}

function readUtf8(file) {
    const raw = fs.readFileSync(file);
    return raw.toString("utf8").replace(/^\uFEFF/, "");
}

function git(args) {
    return execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8"
    }).trim();
}

function gitHash(file) {
    return git(["hash-object", file]);
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

for (const [relative, expectedHash] of Object.entries(manifest.artifacts)) {
    const file = path.join(WAL, relative);

    if (!fs.existsSync(file)) {
        fail(`Missing artifact: ${relative}`);
        continue;
    }

    const actualHash = gitHash(file);

    if (actualHash !== expectedHash) {
        fail(`Hash mismatch: ${relative}`);
        fail(`  expected: ${expectedHash}`);
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
