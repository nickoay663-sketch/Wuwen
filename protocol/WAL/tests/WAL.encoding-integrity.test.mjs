import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../..");
const WAL = path.join(ROOT, "protocol", "WAL");

const HISTORICAL_EXEMPTIONS = new Set([
    "spec/WAL_STANDARD_CORE_v1.0.md",
    "spec/WAL_RULE_INVENTORY_v1.0.md",
    "README.md"
]);

const failures = [];
const scanned = [];

function fail(message) {
    failures.push(message);
}

function scanFile(relativePath) {
    const file = path.join(WAL, relativePath);
    const bytes = fs.readFileSync(file);
    
    if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
        fail("UTF-8 BOM detected: " + relativePath);
    }
    if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
        fail("UTF-16 LE detected: " + relativePath);
    }
    if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) {
        fail("UTF-16 BE detected: " + relativePath);
    }
    
    const text = bytes.toString("utf8");
    if (text.includes("\uFFFD")) {
        fail("Unicode replacement character U+FFFD detected: " + relativePath);
    }
    
    scanned.push(relativePath);
}

function walk(current, relative = "") {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        const rel = path.join(relative, entry.name).replaceAll("\\", "/");
        if (entry.isDirectory()) {
            walk(full, rel);
            continue;
        }
        if (!/\.(md|json|js|mjs|py)$/.test(entry.name)) {
            continue;
        }
        if (HISTORICAL_EXEMPTIONS.has(rel)) {
            continue;
        }
        scanFile(rel);
    }
}

walk(WAL);

if (failures.length > 0) {
    console.error("WAL ENCODING INTEGRITY GATE: FAIL");
    for (const failure of failures) {
        console.error("- " + failure);
    }
    process.exit(1);
}

console.log("WAL ENCODING INTEGRITY GATE: PASS");
console.log("Scanned: " + scanned.length);
console.log("Historical exemptions: " + HISTORICAL_EXEMPTIONS.size);
