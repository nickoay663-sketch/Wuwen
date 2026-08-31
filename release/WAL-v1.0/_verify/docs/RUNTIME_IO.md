Wuwen Runtime I/O Specification v1.0

Status

Architecture Frozen

Purpose

This document defines the input and output interfaces of every Runtime Engine.

Input

RecognitionEngine
Input:
Expression

DefinitionEngine
Input:
Semantic Object

EvidenceEngine
Input:
Semantic Object

CorrespondenceEngine
Input:
Semantic Object

ReasoningEngine
Input:
Semantic Object

ResponsibilityEngine
Input:
Semantic Object

ReconstructionEngine
Input:
Semantic Object

SelfCheckEngine
Input:
Runtime Result

Output

Every Runtime Engine returns:

principle

result

trace

nextRuntimeState

status

questions

version

Core Rule

Every Runtime Engine accepts one defined input.

Every Runtime Engine returns one standardized output.

No Engine reads undefined data.

No Engine modifies another Engine.
