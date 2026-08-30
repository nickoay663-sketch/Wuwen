import WALGatekeeper from './WALGatekeeper.js';

console.log('==================================================');
console.log('       鍕块棶 (Wuwen) Gatekeeper Phase 2 璇箟娴嬭瘯       ');
console.log('==================================================');

const semanticViolationEnvelope = {
    epistemicState: 'CERTAIN',
    rhetoricalTone: 'SPECULATIVE',
    evidence: [{ source: 'Log_A', snippet: 'Partial trace collected.' }],
    claim: 'This definitely guarantees system stability.'
};

const verdict = WALGatekeeper.inspect(semanticViolationEnvelope);
console.log('\n[娴嬭瘯] 璇箟涓庝慨杈炶繚瑙勬嫤鎴祴璇? 鍑嗗叆鐘舵€?= ' + verdict.admitted);
if (!verdict.admitted) {
    console.log('  -> 鎷︽埅鍘熷洜: ' + verdict.reason);
    verdict.violations.forEach(v => console.log('     * 杩濊瑙勫垯 [' + v.rule + ']: ' + v.reason));
}
console.log('==================================================');
