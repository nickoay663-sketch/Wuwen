import MWALGatekeeper from './MWALGatekeeper.js';

console.log('==================================================');
console.log('       莫问 (MoWen) Gatekeeper 联合拦截测试       ');
console.log('==================================================');

const taintedEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [],
    claim: 'Attempting to bypass evidence requirement.'
};

const verdict1 = MWALGatekeeper.inspect(taintedEnvelope);
console.log('\n[测试 1] 违规信封拦截测试: 准入状态 = ' + verdict1.admitted);
if (!verdict1.admitted) {
    console.log('  -> 拦截原因: ' + verdict1.reason);
    verdict1.violations.forEach(v => console.log('     * 违规规则 [' + v.rule + ']: ' + v.reason));
}

const pristineEnvelope = {
    epistemicState: 'ESTABLISHED',
    evidence: [{ source: 'Verified_Store', snippet: 'Fully grounded data payload.' }],
    claim: 'Legitimate grounded assertion.'
};

const verdict2 = MWALGatekeeper.inspect(pristineEnvelope);
console.log('\n[测试 2] 合法信封放行测试: 准入状态 = ' + verdict2.admitted);
console.log('  -> 放行反馈: ' + verdict2.reason);
console.log('==================================================');

