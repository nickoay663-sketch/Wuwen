export default class GatewayAuditEvent {
  constructor(data = {}) {
    this.auditId = data.auditId || data.id || data.audit_id;
    this.eventType = data.eventType || 'GATEWAY_DECISION';
    this.decision = data.decision;
    this.responsibilityState = data.responsibilityState;
    this.verificationState = data.verificationState || data.verificationStatus;
    this.propagationState = data.propagationState;
    this.requestId = data.requestId;
    this.failedRules = data.failedRules || [];
    this.timestamp = data.timestamp || Date.now();
    
    // 兼容测试中可能直接传入的任意额外自定义属性
    Object.keys(data).forEach(key => {
      if (!(key in this)) {
        this[key] = data[key];
      }
    });
  }

  static create(data = {}) {
    return new GatewayAuditEvent(data);
  }

  toJSON() {
    return {
      auditId: this.auditId,
      eventType: this.eventType,
      decision: this.decision,
      responsibilityState: this.responsibilityState,
      verificationState: this.verificationState,
      propagationState: this.propagationState,
      requestId: this.requestId,
      failedRules: this.failedRules,
      timestamp: this.timestamp
    };
  }
}
