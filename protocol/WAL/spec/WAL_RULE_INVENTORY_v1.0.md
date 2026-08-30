# WAL Rule Inventory v1.0

## Purpose

This inventory converts WAL Standard Core v1.0 into individually
identifiable rules that can be independently validated.

A rule is not considered implemented merely because an Engine exists.
Each rule must have observable conformance evidence.

---

## WAL-CORE-01 閳?Expression Identity and Semantic Boundary

### WAL-R01-01
Original expression identity MUST be preserved.

### WAL-R01-02
Expression MAY be analyzed, but MUST NOT be substituted during analysis.

### WAL-R01-03
Original expression MUST remain traceable through the responsibility chain.

### WAL-R01-04
Definition MUST answer what an expression object is without inventing additional meaning.

### WAL-R01-05
Runtime MUST NOT own an externally supplied language system.

### WAL-R01-06
Runtime MUST NOT create or replace the externally supplied language system.

### WAL-R01-07
Undefined objects MUST NOT be forcibly introduced into reasoning.

### WAL-R01-08
Language identification MUST NOT become factual verification.

### WAL-R01-09
Semantic analysis MUST NOT become evidence.

### WAL-R01-10
Expression restatement MUST NOT silently change the original claim.

---

## WAL-CORE-02 閳?Information, Evidence and Correspondence

### WAL-R02-01
Search results MUST NOT automatically become evidence.

### WAL-R02-02
Discovered information MUST remain distinguishable from verified information.

### WAL-R02-03
Evidence MUST remain distinguishable from source existence.

### WAL-R02-04
A source MUST NOT be treated as corresponding evidence merely because it exists.

### WAL-R02-05
Evidence MUST NOT become support without the required responsibility-chain conditions.

### WAL-R02-06
SUPPORTED requires a definition.

### WAL-R02-07
SUPPORTED requires independent evidence.

### WAL-R02-08
SUPPORTED requires explicit verification of the evidence.

### WAL-R02-09
SUPPORTED requires explicit correspondence between evidence and the current expression.

### WAL-R02-10
DISCOVERED MUST NOT automatically promote to VERIFIED.

### WAL-R02-11
UNVERIFIED MUST NOT automatically promote to VERIFIED.

### WAL-R02-12
VERIFIED MUST NOT automatically promote to SUPPORTED.

### WAL-R02-13
VERIFIED_BUT_NOT_LINKED MUST NOT automatically promote to SUPPORTED.

### WAL-R02-14
UNKNOWN MUST NOT be converted to TRUE.

### WAL-R02-15
UNKNOWN MUST NOT be converted to FALSE.

---

## WAL-CORE-03 閳?Epistemic and Responsibility Boundary

### WAL-R03-01
Responsibility MUST NOT exceed the available evidence and correspondence.

### WAL-R03-02
Reasoning MUST NOT exceed the established evidence boundary.

### WAL-R03-03
Responsibility MUST NOT exceed the result that reasoning can legitimately support.

### WAL-R03-04
Later-stage Engines MUST NOT introduce certainty absent from earlier stages.

### WAL-R03-05
UNKNOWN MUST remain a valid final state when evidence is insufficient.

### WAL-R03-06
UNKNOWN MUST NOT be converted merely to satisfy an output requirement.

### WAL-R03-07
The Runtime MUST distinguish known, unknown, verified and unverified information.

### WAL-R03-08
The Runtime MUST distinguish correspondence from non-correspondence.

### WAL-R03-09
The Runtime MUST expose the boundary of what can and cannot be responsibly asserted.

---

## WAL-CORE-04 閳?Responsibility-Bounded Reconstruction

### WAL-R04-01
Reconstruction MUST NOT be used as a punishment or censorship mechanism.

### WAL-R04-02
Reconstruction MAY preserve the user's genuine expression intent.

### WAL-R04-03
Reconstruction MAY preserve content that remains within the responsibility boundary.

### WAL-R04-04
Reconstruction MAY reduce unsupported certainty.

### WAL-R04-05
Reconstruction MAY explicitly preserve unknown portions.

### WAL-R04-06
Reconstruction MUST NOT manufacture evidence.

### WAL-R04-07
Reconstruction MUST NOT manufacture knowledge.

### WAL-R04-08
Generator MUST NOT increase certainty beyond the responsibility chain.

### WAL-R04-09
Generator MUST NOT manufacture facts to make an expression publishable.

### WAL-R04-10
If reconstruction would change the true responsibility object, factual relationship,
evidence relationship or epistemic state, automatic reconstruction MUST stop.

### WAL-R04-11
When automatic reconstruction cannot safely preserve responsibility boundaries,
the Runtime MUST return UNKNOWN or UNRESOLVED.

### WAL-R04-12
Publication MUST NOT be the objective used to justify boundary violations.

---

## Cross-Core Invariants

### WAL-R00-01
Unknown MUST remain explicitly unknown.

### WAL-R00-02
Evidence MUST determine the maximum responsibility that may be assumed.

### WAL-R00-03
No Engine may create unsupported certainty merely to complete the pipeline.

### WAL-R00-04
No Engine may manufacture evidence merely to enable publication.

### WAL-R00-05
No Engine may manufacture knowledge merely to complete an answer.

### WAL-R00-06
Runtime closure MUST NOT imply factual verification.

### WAL-R00-07
Structural contract compliance MUST NOT be interpreted as factual verification.

### WAL-R00-08
Publication authority MUST remain distinct from truth determination.

---

## Inventory Status

Total CORE-01 rules: 10
Total CORE-02 rules: 15
Total CORE-03 rules: 9
Total CORE-04 rules: 12
Total cross-core invariants: 8

Total inventory rules: 54

This inventory is normative only when explicitly adopted by the WAL
standard and independently validated.
