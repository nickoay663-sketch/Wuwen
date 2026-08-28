# MWAL Rule Inventory v1.0

## Purpose

This inventory converts MWAL Standard Core v1.0 into individually
identifiable rules that can be independently validated.

A rule is not considered implemented merely because an Engine exists.
Each rule must have observable conformance evidence.

---

## MWAL-CORE-01 — Expression Identity and Semantic Boundary

### MWAL-R01-01
Original expression identity MUST be preserved.

### MWAL-R01-02
Expression MAY be analyzed, but MUST NOT be substituted during analysis.

### MWAL-R01-03
Original expression MUST remain traceable through the responsibility chain.

### MWAL-R01-04
Definition MUST answer what an expression object is without inventing additional meaning.

### MWAL-R01-05
Runtime MUST NOT own an externally supplied language system.

### MWAL-R01-06
Runtime MUST NOT create or replace the externally supplied language system.

### MWAL-R01-07
Undefined objects MUST NOT be forcibly introduced into reasoning.

### MWAL-R01-08
Language identification MUST NOT become factual verification.

### MWAL-R01-09
Semantic analysis MUST NOT become evidence.

### MWAL-R01-10
Expression restatement MUST NOT silently change the original claim.

---

## MWAL-CORE-02 — Information, Evidence and Correspondence

### MWAL-R02-01
Search results MUST NOT automatically become evidence.

### MWAL-R02-02
Discovered information MUST remain distinguishable from verified information.

### MWAL-R02-03
Evidence MUST remain distinguishable from source existence.

### MWAL-R02-04
A source MUST NOT be treated as corresponding evidence merely because it exists.

### MWAL-R02-05
Evidence MUST NOT become support without the required responsibility-chain conditions.

### MWAL-R02-06
SUPPORTED requires a definition.

### MWAL-R02-07
SUPPORTED requires independent evidence.

### MWAL-R02-08
SUPPORTED requires explicit verification of the evidence.

### MWAL-R02-09
SUPPORTED requires explicit correspondence between evidence and the current expression.

### MWAL-R02-10
DISCOVERED MUST NOT automatically promote to VERIFIED.

### MWAL-R02-11
UNVERIFIED MUST NOT automatically promote to VERIFIED.

### MWAL-R02-12
VERIFIED MUST NOT automatically promote to SUPPORTED.

### MWAL-R02-13
VERIFIED_BUT_NOT_LINKED MUST NOT automatically promote to SUPPORTED.

### MWAL-R02-14
UNKNOWN MUST NOT be converted to TRUE.

### MWAL-R02-15
UNKNOWN MUST NOT be converted to FALSE.

---

## MWAL-CORE-03 — Epistemic and Responsibility Boundary

### MWAL-R03-01
Responsibility MUST NOT exceed the available evidence and correspondence.

### MWAL-R03-02
Reasoning MUST NOT exceed the established evidence boundary.

### MWAL-R03-03
Responsibility MUST NOT exceed the result that reasoning can legitimately support.

### MWAL-R03-04
Later-stage Engines MUST NOT introduce certainty absent from earlier stages.

### MWAL-R03-05
UNKNOWN MUST remain a valid final state when evidence is insufficient.

### MWAL-R03-06
UNKNOWN MUST NOT be converted merely to satisfy an output requirement.

### MWAL-R03-07
The Runtime MUST distinguish known, unknown, verified and unverified information.

### MWAL-R03-08
The Runtime MUST distinguish correspondence from non-correspondence.

### MWAL-R03-09
The Runtime MUST expose the boundary of what can and cannot be responsibly asserted.

---

## MWAL-CORE-04 — Responsibility-Bounded Reconstruction

### MWAL-R04-01
Reconstruction MUST NOT be used as a punishment or censorship mechanism.

### MWAL-R04-02
Reconstruction MAY preserve the user's genuine expression intent.

### MWAL-R04-03
Reconstruction MAY preserve content that remains within the responsibility boundary.

### MWAL-R04-04
Reconstruction MAY reduce unsupported certainty.

### MWAL-R04-05
Reconstruction MAY explicitly preserve unknown portions.

### MWAL-R04-06
Reconstruction MUST NOT manufacture evidence.

### MWAL-R04-07
Reconstruction MUST NOT manufacture knowledge.

### MWAL-R04-08
Generator MUST NOT increase certainty beyond the responsibility chain.

### MWAL-R04-09
Generator MUST NOT manufacture facts to make an expression publishable.

### MWAL-R04-10
If reconstruction would change the true responsibility object, factual relationship,
evidence relationship or epistemic state, automatic reconstruction MUST stop.

### MWAL-R04-11
When automatic reconstruction cannot safely preserve responsibility boundaries,
the Runtime MUST return UNKNOWN or UNRESOLVED.

### MWAL-R04-12
Publication MUST NOT be the objective used to justify boundary violations.

---

## Cross-Core Invariants

### MWAL-R00-01
Unknown MUST remain explicitly unknown.

### MWAL-R00-02
Evidence MUST determine the maximum responsibility that may be assumed.

### MWAL-R00-03
No Engine may create unsupported certainty merely to complete the pipeline.

### MWAL-R00-04
No Engine may manufacture evidence merely to enable publication.

### MWAL-R00-05
No Engine may manufacture knowledge merely to complete an answer.

### MWAL-R00-06
Runtime closure MUST NOT imply factual verification.

### MWAL-R00-07
Structural contract compliance MUST NOT be interpreted as factual verification.

### MWAL-R00-08
Publication authority MUST remain distinct from truth determination.

---

## Inventory Status

Total CORE-01 rules: 10
Total CORE-02 rules: 15
Total CORE-03 rules: 9
Total CORE-04 rules: 12
Total cross-core invariants: 8

Total inventory rules: 54

This inventory is normative only when explicitly adopted by the MWAL
standard and independently validated.
