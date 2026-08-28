import HonestRuntime from "./HonestRuntime.js";

const runtime = new HonestRuntime("这是一个事实");
const result = await runtime.run();

console.log("=== RESULT KEYS ===");
console.log(Object.keys(result || {}));

console.log("=== RESPONSIBILITY EVENT KEYS ===");
console.log(
    Object.keys(
        result?.responsibilityEvent || {}
    )
);

console.log("=== RESULT MWAL KEYS ===");
console.log(
    result?.mwalEnvelope
        ? Object.keys(result.mwalEnvelope)
        : "NO result.mwalEnvelope"
);
