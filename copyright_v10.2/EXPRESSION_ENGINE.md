# Expression Engine v1.1

# 勿问表达引擎 v1.1


## Purpose

Expression Engine is the entrance layer of Wuwen.

Its responsibility is to transform input expression into a structured expression object before entering Honest Runtime.

表达引擎是勿问的入口层。

它负责将输入表达转化为结构化表达对象，然后进入诚实运行。


---

# Core Principle

Wuwen does not process language itself.

Wuwen processes expressions inside their original language environment.

Language establishes testimony environment.

Expression establishes responsibility object.


勿问不处理语言本身。

勿问处理处于原始语言环境中的表达。

语言建立证词环境。

表达建立责任对象。


---

# Runtime Flow


Input Expression

↓

Language Runtime

↓

Expression Engine

↓

Structured Expression Object

↓

Recognition

↓

Definition

↓

Object Resolution

↓

Honest Runtime

↓

Reconstruction

↓

Report


输入表达

↓

语言运行系统

↓

表达引擎

↓

结构化表达对象

↓

识别

↓

定义

↓

对象解析

↓

诚实运行

↓

重构

↓

报告


---

# Language Environment


Language Runtime provides:

- Original language
- Language environment
- Expression context


语言运行系统提供：

- 原始语言
- 语言运行环境
- 表达上下文


Expression Engine preserves the original expression environment.

表达引擎保持原始表达环境。


---

# Expression Object


Each expression entering Wuwen becomes a Structured Expression Object.


每一个进入勿问的表达，都成为结构化表达对象。


Example:


```json
{
 "content":"",
 "language":"",
 "environment":"",
 "type":"",
 "subject":"",
 "object":"",
 "concept":"",
 "status":""
}
