# WAL Protocol

WAL (Wuwen Accountability Layer) is an open, independent responsibility and audit protocol for AI and autonomous agents.

It defines a verifiable boundary between claims, evidence, verification, reasoning, and responsibility. WAL does not require trust in any specific runtime implementation.

## 5-Minute Quickstart

### 1. Verify a WAL Envelope

From the repository root:

    node .\protocol\WAL\bin\wal-verify.js .\protocol\WAL\examples\conform\valid-envelope.json

A conforming envelope should be accepted by the WAL validator.

### 2. Run the 54-Rule Conformance Suite

    node .\protocol\WAL\tests\WAL.conformance.test.mjs

Expected result:

    status: CONFORM
    passed: true
    totalRulesChecked: 54
    passedRules: 54
    failedRules: []

### 3. Run the Clean-Room Conformance Suite

    node .\protocol\WAL\tests\clean-room-conformance.test.mjs

Expected result:

    Clean-room conformance suite passed successfully.

## Core Artifacts

- [White Paper](./WHITE_PAPER.md) ！ architecture, threat model, and protocol philosophy.
- [Integration Guide](./INTEGRATION.md) ！ integration guidance for external implementations.
- [JSON Schema](./schema/wal-envelope.schema.json) ！ cross-language structural specification.
- [WAL Standard Core](./spec/WAL_STANDARD_CORE_v1.0.md) ！ normative protocol core.
- [WAL Rule Inventory](./spec/WAL_RULE_INVENTORY_v1.0.md) ！ 54 normative rules.
- [Conformance Map](./spec/WAL_CONFORMANCE_MAP_v1.0.md) ！ rule-to-test mapping.
- [Independent Validator Contract](./spec/WAL_INDEPENDENT_VALIDATOR_CONTRACT_v1.0.md) ！ validator contract.
- [Responsibility Record](./spec/WAL_RESPONSIBILITY_RECORD_v1.0.md) ！ responsibility record specification.
- [Provenance Evidence Pack](./spec/WAL_PROVENANCE_EVIDENCE_PACK_v1.0.md) ！ reproducible provenance-boundary evidence.
- [Reference Validator](./validator/WALReferenceValidator.mjs) ！ standalone reference-envelope validator.

## Design Boundary

WAL does not determine arbitrary external factual truth.

Instead, WAL verifies whether a submitted responsibility envelope conforms to the protocol's defined evidence, epistemic, correspondence, responsibility, and publication boundaries.

The protocol therefore distinguishes:

- claim from evidence
- discovery from verification
- verification from support
- knowledge from assertion
- responsibility from factual truth
- external provenance claims from runtime verification
- publication authority from truth determination

Unsupported certainty must remain unsupported.

UNKNOWN remains a valid state.

## Independent Verification

WAL is designed so that an implementation can be evaluated independently of the Wuwen Runtime.

A verifier may validate a WAL envelope using the protocol specification, schema, rule inventory, and independent validator without executing HonestRuntime.

The reference implementation is evidence of the protocol implementation; it is not the source of truth for the protocol itself.

## Version

- Protocol: WAL v1.0
- Standard Core: v1.0
- Rule Inventory: v1.0
- Independent Validator: v1.1
- Runtime baseline: Wuwen Runtime v10.8

## License

See the repository license for applicable terms.
