# Wuwen Definition Search

Version: 1.2

# 勿问定义检索系统 v1.2


## Purpose

Definition Search provides available definitions for Runtime concepts.

定义检索为 Runtime 概念提供可用定义。


Wuwen does not select the final definition.

Wuwen does not replace existing definitions.

勿问不选择唯一最终定义。

勿问不替换已有定义。


---

# Core Principle


Definition comes before reasoning.


没有定义，就没有推理。


Definition Search only provides definition resources.

定义检索只提供定义资源。


Correspondence determines whether definitions match expressions.

对应关系决定定义是否匹配表达。


---

# Position


Semantic Object

↓

Concept Recognition

↓

Definition Search

↓

Definition Objects

↓

Definition Engine

↓

Correspondence


---

# Definition Categories


Definition Search may retrieve:


## Standard Definition

Official or recognized definitions.


标准定义。


---

## Dictionary Definition

General language definitions.


词典定义。


---

## Encyclopedia Definition

General knowledge explanations.


百科定义。


---

## Professional Definition

Domain-specific definitions.


专业定义。


---

## Law Definition

Legal definitions from legal systems.


法律定义。


---

## Science Definition

Scientific definitions.


科学定义。


---

## Industry Standard Definition

Definitions from recognized standards.


行业标准定义。


---

## User Definition


Definitions provided by expression provider.


用户定义。


User definitions remain testimony.

用户定义仍然属于证词。


---

## Runtime Definition


Definitions created for internal Runtime operation.


Runtime 内部运行定义。


Runtime definitions do not replace external definitions.


Runtime 定义不替代外部定义。


---

# Definition Object


Each definition record contains:


```json
{
 "concept":"",
 "definition":"",
 "category":"",
 "language":"",
 "source":"",
 "version":"",
 "responsibility":""
}
