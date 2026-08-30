import WALValidatorR00Core from './WALValidatorR00Core.js';

console.log('==================================================');
console.log('       鍕块棶 (Wuwen) R00-02~05 鏍稿績涓嶅彉閲忛獙璇佹祴璇?      ');
console.log('==================================================');

const invalidEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [],
    claim: 'Unverified assertions.'
};

const result1 = WALValidatorR00Core.validateAll(invalidEnvelope);
console.log('\n[娴嬭瘯 1] 闈炴硶 Envelope 楠岃瘉缁撴灉: 鎴愬姛 = ' + result1.success);
if (!result1.success) {
    result1.failures.forEach(f => console.log('  -> 鎷︽埅瑙勫垯 [' + f.rule + ']: ' + f.reason));
}

const validEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [{ source: 'Core_Spec', snippet: 'Verified structural requirement.' }],
    claim: 'Grounded assertion.'
};

const result2 = WALValidatorR00Core.validateAll(validEnvelope);
console.log('\n[娴嬭瘯 2] 鍚堟硶 Envelope 楠岃瘉缁撴灉: 鎴愬姛 = ' + result2.success);
console.log('==================================================');
