# MWAL Independent Validator Contract v1.0

## Status

Normative specification for independent validation of MWAL conformance.

## Purpose

The Independent Validator determines whether an MWAL implementation conforms to
the declared MWAL rules and boundaries.

The Independent Validator does not:

- determine factual truth;
- create evidence;
- create verification;
- create responsibility;
- modify the Runtime result;
- grant publication authority.

## Independence Principle

The Validator MUST evaluate the supplied MWAL record from outside the Runtime
implementation being validated.

The Validator MUST NOT trust Runtime self-check results as sufficient proof of
conformance.

## Validation Domains

The Validator MUST validate:

1. Expression identity and traceability.
2. Evidence and verification boundaries.
3. Responsibility boundaries.
4. Reconstruction and Generator boundaries.
5. Epistemic-state integrity.
6. Publication boundary.
7. Required MWAL Responsibility Record structure.

## Required Result

The Validator MUST return:

- `status`
- `passed`
- `totalRulesChecked`
- `passedRules`
- `failedRules`
- `checks`

`status` MUST be either:

- `CONFORM`
- `NON_CONFORM`

## Failure Principle

Any failed mandatory rule MUST produce `NON_CONFORM`.

A Runtime claim of `selfCheck.passed === true` MUST NOT override an independent
validation failure.

## No Authority Escalation

Independent validation confirms conformance only.

Conformance MUST NOT be interpreted as:

- factual truth;
- legal responsibility;
- identity ownership;
- evidence authenticity;
- publication authorization.

## Attack Resistance

The Validator MUST reject records that attempt to:

- promote `UNKNOWN` to `VERIFIED` or `SUPPORTED` without required evidence;
- promote `DISCOVERED` directly to `VERIFIED` or `SUPPORTED`;
- promote `VERIFIED` directly to `SUPPORTED` without required conditions;
- claim responsibility beyond available evidence;
- manufacture evidence during reconstruction;
- manufacture facts during generation;
- use Runtime closure as proof of factual verification;
- use Runtime self-check as a substitute for independent validation.

## Reference

The Validator SHALL use:

- MWAL Rule Inventory v1.0
- MWAL Responsibility Record v1.0
- MWAL Conformance Map v1.0
- MWAL Contract v1.0

as normative inputs.
