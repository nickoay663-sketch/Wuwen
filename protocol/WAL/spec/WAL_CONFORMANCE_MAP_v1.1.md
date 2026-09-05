# WAL Conformance Map v1.1

## Status

Canonical WAL Protocol conformance map for the v1.1 protocol
generation.

This document maps normative WAL requirements to their
corresponding protocol components, implementation boundaries,
validation mechanisms, and executable conformance evidence.

This document does not rewrite or replace the historical
WAL Conformance Map v1.0 artifact.

## Canonical Language

English is the canonical language for this protocol artifact.

Translations MAY be provided for accessibility or explanatory
purposes, but MUST NOT override the meaning of the canonical
English specification.

All protocol text SHOULD be stored as UTF-8.

## Conformance Model

WAL conformance is established through traceable relationships
between:

1. normative rules;
2. protocol specifications;
3. implementation boundaries;
4. independent validation;
5. executable tests;
6. Git history.

A statement is not considered conformant merely because it appears
in documentation.

Where executable validation exists, implementation behavior MUST
remain consistent with the applicable normative rule.

## WAL Core Conformance

### WAL-CORE-01 — Expression Identity and Semantic Boundary

Normative source:

- WAL Standard Core v1.1
- CORE-01 Rules
- WAL-R01-01 through WAL-R01-10

Primary implementation components:

- RecognitionEngine
- DefinitionEngine
- LanguageAdapter
- TestimonyBuilder
- TestimonyValidator

Core conformance requirements:

- preserve original expression identity;
- maintain traceability through the responsibility chain;
- keep semantic analysis distinct from evidence;
- keep language identification distinct from factual verification;
- prevent silent alteration of the original claim.

### WAL-CORE-02 — Information, Evidence and Correspondence

Normative source:

- WAL Standard Core v1.1
- CORE-02 Rules
- WAL-R02-01 through WAL-R02-15

Primary implementation components:

- SearchEngine
- EvidenceEngine
- CorrespondenceEngine

Core conformance requirements:

- search results MUST NOT automatically become evidence;
- discovered information MUST remain distinguishable from verified
  information;
- evidence MUST remain distinguishable from source existence;
- evidence MUST NOT become support without the required
  responsibility-chain conditions;
- SUPPORTED MUST require definition, independent evidence, explicit
  verification, and explicit correspondence.

### WAL-CORE-03 — Epistemic and Responsibility Boundary

Normative source:

- WAL Standard Core v1.1
- CORE-03 Rules
- WAL-R03-01 through WAL-R03-09

Primary implementation components:

- ReasoningEngine
- ResponsibilityEngine
- SelfCheckEngine

Core conformance requirements:

- responsibility MUST NOT exceed available evidence and
  correspondence;
- reasoning MUST remain within the established evidence boundary;
- later stages MUST NOT introduce unsupported certainty;
- UNKNOWN MUST remain a valid final state;
- the Runtime MUST expose the boundary of responsible assertion.

### WAL-CORE-04 — Responsibility-Bounded Reconstruction

Normative source:

- WAL Standard Core v1.1
- CORE-04 Rules
- WAL-R04-01 through WAL-R04-12

Primary implementation components:

- ReconstructionEngine
- GeneratorEngine
- SelfCheckEngine

Core conformance requirements:

- reconstruction MUST remain within the responsibility boundary;
- reconstruction MUST NOT manufacture evidence or knowledge;
- unsupported certainty MAY be reduced but MUST NOT be fabricated;
- Generator MUST NOT increase certainty beyond the responsibility
  chain;
- unsafe automatic reconstruction MUST stop;
- unsafe reconstruction MUST return UNKNOWN or UNRESOLVED where
  required;
- publication MUST NOT justify a responsibility-boundary violation.

## Cross-Core Invariants

The following invariants apply across the complete WAL protocol.

### WAL-R00-01

Unknown MUST remain explicitly unknown.

### WAL-R00-02

Evidence MUST determine the maximum responsibility that may be
assumed.

### WAL-R00-03

Later processing MUST NOT introduce unsupported certainty.

### WAL-R00-04

Protocol state transitions MUST remain traceable to the applicable
responsibility-chain conditions.

## Responsibility Record Boundary

Responsibility records represent the protocol-level record of the
responsibility state established by the Runtime.

A responsibility record MUST NOT be treated as independent evidence
merely because it exists.

The responsibility record MUST remain traceable to the expression,
evidence, verification state, correspondence state, reasoning result,
and applicable protocol rules.

## Publication Boundary

Publication MUST remain downstream of responsibility determination.

A publication mechanism MUST NOT:

- manufacture evidence;
- manufacture verification;
- manufacture responsibility;
- upgrade UNKNOWN to TRUE;
- bypass independent validation;
- bypass responsibility-boundary checks.

Publication success MUST NOT itself establish factual correctness.

## Independent Validation Boundary

Independent validation MUST operate as a boundary separate from the
Runtime's internal decision-making.

An external validator MUST be able to reject malformed, forged,
tampered, or non-conformant WAL envelopes without trusting the
Runtime that produced them.

The validator MUST NOT grant authority to fields merely because
those fields claim a stronger governance state.

## Gateway Conformance

### WAL-GATEWAY-01 — Gateway Adapter Boundary

Normative source:

- WAL Gateway Adapter Contract v1.0

Purpose:

The Gateway Adapter connects WAL governance capability to an
external gateway or HTTP framework without assuming ownership of the
internal WAL Runtime governance engines.

The Gateway Adapter:

- MUST preserve the WAL governance boundary;
- MUST validate externally supplied governance data;
- MUST NOT treat client-controlled governance fields as authoritative;
- MUST fail closed when required audit persistence fails;
- MUST preserve audit traceability;
- MUST prevent tampered audit records from producing an ALLOW result;
- MUST preserve cryptographic linkage between audit records;
- MUST remain independently testable.

The Gateway Adapter MUST NOT govern or replace the internal WAL
Runtime engines.

## Gateway Executable Evidence

Gateway conformance is supported by executable integration and
adversarial tests covering, where applicable:

- valid WAL submission;
- fraudulent unsupported certainty;
- malformed payload rejection;
- audit persistence failure;
- audit-chain integrity failure;
- tampered audit records;
- forged governance fields;
- audit event field integrity;
- audit ledger tampering;
- deletion of intermediate records;
- malformed audit records;
- chained record linkage.

Executable evidence MUST remain traceable through Git commits.

## Traceability

Conformance claims SHOULD identify the applicable:

- normative specification;
- implementation component;
- validator;
- executable test;
- Git commit.

External discussion, screenshots, chat history, or informal claims
MUST NOT be required to establish protocol conformance.

## Versioning

This document is version v1.1.

Changes to normative conformance boundaries SHOULD result in a
corresponding protocol version update.

Historical conformance artifacts MUST remain preserved.

## Canonicalization Notice

This document is the canonical English conformance map for WAL
Protocol v1.1.

It is intended to provide a stable bridge between normative rules,
implementation boundaries, independent validation, executable
evidence, and Git-traceable protocol history.
