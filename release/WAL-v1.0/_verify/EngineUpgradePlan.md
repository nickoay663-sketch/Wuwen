RecognitionEngine
□ Interface

DefinitionEngine
□ Interface

SearchEngine
□ Interface

EvidenceEngine
□ Interface

CorrespondenceEngine
□ Interface

ReasoningEngine
□ Interface

ResponsibilityEngine
□ Interface

ReconstructionEngine
□ Interface

SelfCheckEngine
□ Interface

# Phase 1

Interface Freeze

Goal:

Freeze one unified Engine Interface before modifying any Runtime Engine.

No Engine implementation changes are allowed before the interface is frozen.

---

Unified Engine Interface

Every Engine must follow:

Input

↓

Verify

↓

Process

↓

Output

Standard Output

status

result

trace

nextRuntimeState

Only after this interface is frozen,

all Runtime Engines will be upgraded together.
