Wuwen Runtime Interface v3.0

Status

Architecture Frozen

Purpose

This document defines the official interfaces between all Runtime Engines.

Every Runtime Engine shall follow this interface.

Runtime Flow

Language Runtime

↓

RecognitionEngine

↓

DefinitionEngine

↓

EvidenceEngine

↓

CorrespondenceEngine

↓

ReasoningEngine

↓

ResponsibilityEngine

↓

ReconstructionEngine

↓

SelfCheckEngine

↓

Runtime Completed

Runtime Engine Interface

Every Engine returns:

principle

result

trace

nextRuntimeState

status

questions

version

Core Runtime Object

Semantic Object

Official Runtime Rule

One Runtime

One Semantic Object

One Responsibility Chain

One Runtime Result

No Engine shall redefine another Engine.

No Engine shall skip Runtime order.

Runtime interfaces are frozen.
