import MWALValidatorR00Core from './MWALValidatorR00Core.js';

console.log('==================================================');
console.log('       莫问 (MoWen) R00-02~05 核心不变量验证测试       ');
console.log('==================================================');

const invalidEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [],
    claim: 'Unverified assertions.'
};

const result1 = MWALValidatorR00Core.validateAll(invalidEnvelope);
console.log('\n[测试 1] 非法 Envelope 验证结果: 成功 = ' + result1.success);
if (!result1.success) {
    result1.failures.forEach(f => console.log('  -> 拦截规则 [' + f.rule + ']: ' + f.reason));
}

const validEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [{ source: 'Core_Spec', snippet: 'Verified structural requirement.' }],
    claim: 'Grounded assertion.'
};

const result2 = MWALValidatorR00Core.validateAll(validEnvelope);
console.log('\n[测试 2] 合法 Envelope 验证结果: 成功 = ' + result2.success);
console.log('==================================================');

