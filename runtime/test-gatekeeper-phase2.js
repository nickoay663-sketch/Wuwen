import MWALGatekeeper from './MWALGatekeeper.js';

console.log('==================================================');
console.log('       莫问 (MoWen) Gatekeeper Phase 2 语义测试       ');
console.log('==================================================');

const semanticViolationEnvelope = {
    epistemicState: 'CERTAIN',
    rhetoricalTone: 'SPECULATIVE',
    evidence: [{ source: 'Log_A', snippet: 'Partial trace collected.' }],
    claim: 'This definitely guarantees system stability.'
};

const verdict = MWALGatekeeper.inspect(semanticViolationEnvelope);
console.log('\n[测试] 语义与修辞违规拦截测试: 准入状态 = ' + verdict.admitted);
if (!verdict.admitted) {
    console.log('  -> 拦截原因: ' + verdict.reason);
    verdict.violations.forEach(v => console.log('     * 违规规则 [' + v.rule + ']: ' + v.reason));
}
console.log('==================================================');

