# WAL Protocol Integration Guide

This guide explains how external developers and agent frameworks (Python, Go, Rust, Java, etc.) can integrate the WAL Protocol without depending on the Wuwen runtime.

## 1. Integration Steps

1. **Adopt JSON Schema:** Use schema/wal-envelope.schema.json in your internal validation pipeline to ensure every agent output or decision frame conforms to the WAL structure.
2. **Generate Envelopes:** When an agent produces an action, wrap the execution context into a WAL JSON envelope containing mandatory fields (eventId, expression, identity, 	imestamp, erificationState, esponsibilityState, propagationState, untimeVersion, contractVersion).
3. **Audit via CLI or Validator:** Use the reference CLI tool to check compliance before downstream propagation:
   \\\ash
   node bin/wal-verify.js path/to/your-envelope.json
   \\\

## 2. Multi-Language Validation

Any language that supports JSON parsing and structural validation can emit WAL envelopes. Ensure that internal runtime state objects (such as engine registries or memory dumps) are **never** included in the envelope, otherwise rule **R04-01 (Runtime Leakage Isolation)** will fail the audit.
