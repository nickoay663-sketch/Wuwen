class EpistemicGateway {
  constructor(runtimeCore, options = {}) {
    this.core = runtimeCore;
    this.strictMode = options.strictMode ?? true;
  }

  inbound(rawPayload, provenanceMetadata = {}) {
    const record = {
      id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      payload: rawPayload,
      epistemicState: 'UNKNOWN',
      verificationStatus: 'UNVERIFIED',
      verifiedEvidenceCount: 0,
      sourceCount: provenanceMetadata.sourceCount || 0,
      provenance: provenanceMetadata.sources || [],
      demand: provenanceMetadata.demand || 'high',
      capacity: 'none',
      canPropagate: false,
      canPublish: false,
      timestamp: Date.now()
    };
    return this.core.evaluateInbound(record);
  }

  outbound(record, generatedContent) {
    const guardResult = this.core.evaluateOutbound({
      ...record,
      content: generatedContent
    });
    if (!guardResult.publishable && this.strictMode) {
      return {
        success: false,
        blocked: true,
        reason: 'Epistemic boundary exceeded or unverified promotion blocked.',
        fallback: '⚠️ [WuWen 运行时拦截]：该生成内容由于缺乏足够的已验证证据支持，触发边界保护，已被安全降级或拦截。',
        trace: guardResult
      };
    }
    return { success: true, blocked: false, content: generatedContent, trace: guardResult };
  }
}

module.exports = EpistemicGateway;
