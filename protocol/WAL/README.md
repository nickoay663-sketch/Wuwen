# WAL Protocol (Wuwen Accountability & Verification Layer)

WAL Protocol is an open, independent responsibility and audit framework for AI and Autonomous Agents. It ensures that AI decision-making, evidence bounds, and responsibility states can be mathematically audited and verified without relying on any specific underlying runtime.

## 5-Minute Quickstart

1. **Verify an Envelope via CLI:**
   \\\ash
   node bin/wal-verify.js protocol/WAL/examples/conform/valid-envelope.json
   \\\

2. **Core Artifacts:**
   - [White Paper](./WHITE_PAPER.md): Architecture, threat model, and protocol philosophy.
   - [Integration Guide](./INTEGRATION.md): How to generate envelopes and integrate in Python, Go, Rust, or Java.
   - [JSON Schema](./schema/wal-envelope.schema.json): Cross-language structural specification.
   - [Validator](./validator/WALIndependentValidator.js): Standalone reference validator.
