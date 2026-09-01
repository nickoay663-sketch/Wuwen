import {
  WALIndependentValidator
} from "../../packages/core/src/index.js";

console.log("=== Wuwen Gateway Sandbox ===\n");

const validator = new WALIndependentValidator();

const validEnvelope = {
  eventId: "evt-conform-2026-001",
  expression: "standard-verified-agent-action",
  identity: "ExternalAgent-01",
  timestamp: "2026-08-30T12:00:00Z",
  verificationState: "VERIFIED",
  responsibilityState: "ESTABLISHED",
  propagationState: "ALLOW",
  runtimeVersion: "external-v1.0",
  contractVersion: "1.0",
  responsibility: null,
  evidence: [
    {
      source: "verified-db",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  ]
};

const attackEnvelope = {
  version: "1.0",
  epistemicState: "TRUE",
  verificationClaim: "forged_claim",
  supported: true,
  publishable: true,
  timestamp: Date.now()
};

console.log("=== 1. CONFORM ===");

const validResult = validator.validateEnvelope(validEnvelope);

console.log("Validation Status:", validResult.status);
console.log("Passed:", validResult.passed);
console.log("Total Rules Checked:", validResult.totalRulesChecked);
console.log("Failed Rules Count:", validResult.failedRules.length);

console.log("\n=== 2. ATTACK ===");

const attackResult = validator.validateEnvelope(attackEnvelope);

console.log("Validation Status:", attackResult.status);
console.log("Passed:", attackResult.passed);
console.log("Total Rules Checked:", attackResult.totalRulesChecked);
console.log("Failed Rules Count:", attackResult.failedRules.length);

if (!attackResult.passed) {
  console.log("\n🛡️ Attack Successfully Intercepted:");
  attackResult.failedRules.forEach(r =>
    console.log("  - [" + r.rule + "] " + r.name)
  );
}
