import fs from "fs";
import ResponsibilityLedger from "./ResponsibilityLedger.js";

console.log("=== CHAIN CASCADE TAMPER EXPERIMENT ===");

const file = "./Wuwen-chain-cascade-tamper-test.jsonl";

if (fs.existsSync(file)) fs.unlinkSync(file);

const ledger = new ResponsibilityLedger(file);

ledger.append(
    {
        id: "rec_chain_001",
        epistemicState: "ESTABLISHED",
        verificationStatus: "SUPPORTED",
        verifiedEvidenceCount: 1,
        canPublish: true
    },
    [{ source: "source_1", snippet: "Evidence 1" }]
);

ledger.append(
    {
        id: "rec_chain_002",
        epistemicState: "ESTABLISHED",
        verificationStatus: "SUPPORTED",
        verifiedEvidenceCount: 1,
        canPublish: true
    },
    [{ source: "source_2", snippet: "Evidence 2" }]
);

// 篡改第一条记录的证据
const records = fs.readFileSync(file, "utf8")
    .trim()
    .split("\n")
    .map(line => JSON.parse(line));

records[0].evidence[0].snippet = "FORGED FIRST RECORD";

fs.writeFileSync(
    file,
    records.map(record => JSON.stringify(record)).join("\n") + "\n",
    "utf8"
);

const result = ledger.verifyIntegrity();

console.log("Tampered: true");
console.log("verifyIntegrity.valid:", result.valid);
console.log("Error:", result.error);

if (!result.valid) {
    console.log("Result: 🛡️ CHAIN CASCADE TAMPERING BLOCKED");
} else {
    console.log("Result: ⚠️ CHAIN CASCADE TAMPERING NOT DETECTED");
}

fs.unlinkSync(file);
