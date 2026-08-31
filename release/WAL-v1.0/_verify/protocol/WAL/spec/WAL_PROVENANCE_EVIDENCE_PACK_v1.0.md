# WAL Provenance Evidence Pack v1.0

## Purpose

This evidence pack records independently reproducible evidence
for the provenance boundary of the Wuwen Accountability Layer (WAL).

It does not introduce new WAL rules.
It documents evidence produced by existing conformance and attack tests.

---

## Identity

- System: Wuwen
- Protocol: WAL
- WAL Contract: v1.0
- Standard Core: v1.0
- Rule Inventory: v1.0
- Independent Validator: v1.1
- Runtime baseline: v10.8

---

## Evidence E01 �� 54-Rule Conformance

Command:

    node .\protocol\WAL\tests\WAL.conformance.test.mjs

Expected result:

    status: CONFORM
    passed: true
    totalRulesChecked: 54
    passedRules: 54
    failedRules: []

Interpretation:

The reference envelope conforms to all 54 rules checked by
the WAL Independent Validator.

---

## Evidence E02 �� Independent Validator Attack Test

Command:

    node .\protocol\WAL\tests\WAL.independent-validator.attack.test.mjs

Expected result:

    === WAL INDEPENDENT VALIDATOR ATTACK TEST PASSED ===

Attack classes include:

- UNKNOWN -> TRUE
- UNKNOWN -> FALSE
- forged propagation ALLOW
- search result promoted to evidence
- forged VERIFIED
- forged SUPPORTED
- responsibility exceeding evidence
- runtime leakage

Interpretation:

The independent validator rejects tested attempts to create
unsupported epistemic certainty, unsupported propagation,
unsupported evidence, unsupported responsibility, or runtime leakage.

---

## Evidence E03 �� External Provenance Boundary Attack

Command:

    node .\protocol\WAL\run-external-provenance-attack.mjs

Expected result:

    === RESULT: EXTERNAL PROVENANCE ATTACK BLOCKED ===

The test supplies externally asserted:

- verified=true
- verificationStatus=VERIFIED
- epistemicState=VERIFIED
- runtimeVerificationRecord=true
- supportsClaim=true
- independent=true

The external boundary adapters must preserve the external
verification claim while preventing it from becoming runtime
verification.

Expected normalized state:

- externalVerificationClaim = true
- verificationStatus = UNVERIFIED
- epistemicState = DISCOVERED
- verified = false
- runtimeVerificationRecord = false

Interpretation:

Externally asserted verification is not accepted as runtime
verification authority.

---

## Evidence E04 �� Reference Validator Positive Fixture

Command:

    node .\protocol\WAL\validator\WALReferenceValidator.mjs .\protocol\WAL\wal-reference-test-envelope.json

Expected result:

    status: CONFORM
    passed: true
    totalRulesChecked: 54
    passedRules: 54
    failedRules: []

Exit code:

    0

Interpretation:

A standalone reference-envelope file can be independently
submitted to the WAL Independent Validator and accepted without
running HonestRuntime.

---

## Evidence E05 �� Reference Validator Tamper Detection

Procedure:

Modify only:

    verificationState: UNKNOWN

to:

    verificationState: VERIFIED

Then run:

    node .\protocol\WAL\validator\WALReferenceValidator.mjs .\protocol\WAL\reference-test-envelope-tampered.json

Observed result:

    status: NON_CONFORM
    passed: false
    totalRulesChecked: 54
    passedRules: 53
    failedRules:
        WAL-R00-03

Observed exit code:

    1

Interpretation:

A provenance envelope containing unsupported verification certainty
is rejected by the independent validator.

---

## Boundary Statement

The evidence above supports the following bounded conclusion:

WAL v1.0 provides an independently executable validation boundary
in which externally asserted verification, unsupported certainty,
unsupported evidence promotion, unsupported responsibility, and
runtime-internal leakage are rejected by the validator or blocked
at the external provenance boundary.

This evidence pack does not claim factual truth of arbitrary external
claims. It establishes protocol conformance and boundary behavior
only.

---

## Reproducibility

All evidence is based on executable artifacts present in the
Wuwen Runtime v10.8 repository.

Evidence should be regenerated from the commands above rather than
treated as immutable textual assertions.

---

## Status

Evidence Pack: v1.0
Protocol: WAL v1.0
Runtime baseline: Wuwen Runtime v10.8
