import { WALIndependentValidator } from '../../packages/core/src/index.js';

console.log("=== Wuwen Gateway Sandbox: Final Integration Demo ===\n");
const validator = new WALIndependentValidator();

const attackEnvelope = {
  version: "1.0",
  epistemicState: "TRUE",
  verificationClaim: "forged_claim",
  supported: true,
  publishable: true,
  timestamp: Date.now()
};

const result = validator.validateEnvelope(attackEnvelope);
console.log("Validation Status:", result.status);
console.log("Total Rules Checked:", result.totalRulesChecked);
console.log("Failed Rules Count:", result.failedRules.length);

if (!result.passed) {
  console.log("\n🛡️ Attack Successfully Intercepted by Rules:");
  result.failedRules.forEach(r => console.log("  - [" + r.rule + "] " + r.name));
}
