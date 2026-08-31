Wuwen Architecture Layer v1.1

勿问系统分层架构

---

一、架构原则

勿问不是由功能堆积形成的程序。

勿问是由价值、运行、现象、实现四个层次构成的完整系统。

不同层次承担不同责任。

任何层次不得越权。

重构不是推翻过去。

重构是在保持核心原则不变的基础上，重新组织结构，使责任更加清晰。

---

Layer 1：Value Layer（价值层）

核心：诚实

诚实不是勿问的功能。

诚实不是勿问附加的规则。

诚实是勿问存在的方式。

勿问因诚实而运行。

离开诚实，勿问不再是勿问。

因此：

所有识别、定义、检索、证据、对应、推理、责任检查和重构，都必须服从诚实。

---

Layer 2：Runtime Layer（运行层）

目的

将输入表达转化为可检验、可修正、可重构的证词链。

Runtime Flow

Waiting

↓

Recognition

识别证词、对象、关系

↓

Definition

建立概念定义

↓

Correspondence

检查表达与对象、定义之间的对应

↓

Evidence

检查证据支持

↓

Reasoning

检查推理链

↓

Responsibility

检查责任承担

↓

Reconstruction

重构表达

↓

Waiting

等待新的证词

---

Search Service

检索不是 Runtime 流程中的一个固定步骤。

检索是 Runtime 的统一能力。

所有 Runtime Engine 在需要信息时，都可以调用 Search Service。

Search Service 支持：

- Recognition
- Definition
- Evidence
- Correspondence
- Reasoning
- Responsibility
- Reconstruction

检索贯穿整个运行过程。

---

Layer 3：Phenomenon Layer（现象层）

诚实运行后的自然表现：

- 一致性
- 完整性
- 对应性
- 可追溯性
- 可修正性

这些不是勿问的根。

这些是诚实运行后的结果。

勿问不制造结论。

勿问帮助表达承担责任。

---

Layer 4：Implementation Layer（实现层）

目的

将勿问架构转化为可运行系统。

实现层服从运行层。

运行层服从价值层。

程序不能改变勿问原则。

---

Implementation Structure

Engine Layer

负责实现 Runtime 的具体检验能力。

包括：

- Recognition Engine
- Definition Engine
- Evidence Engine
- Correspondence Engine
- Reasoning Engine
- Responsibility Engine
- Reconstruction Engine

Service Layer

提供 Runtime 所需的统一服务。

包括：

- Search Service

Knowledge Layer

提供 Runtime 所需知识结构。

包括：

- Definition Library
- Evidence Library
- Knowledge Library
- Correspondence Rules

Interface Layer

负责人与勿问之间的交互。

包括：

- UI
- API
- Language Interface

---

架构自检原则

任何新增功能进入勿问之前，必须回答：

1. 是否符合诚实原则？
2. 属于哪个层？
3. 承担什么责任？
4. 如何被 Runtime 检验？
5. 如何实现？

无法回答者，不进入勿问。

---

最终架构

Value Layer
（价值层）
↓

Runtime Layer
（运行层）
↓

Phenomenon Layer
（现象层）
↓

Implementation Layer
（实现层）

Implementation Layer 内部：

Engine

↓

Service

↓

Knowledge

↓

Interface

---

勿问使命

勿问不是为了替人产生答案。

勿问通过诚实运行，帮助表达不断重构。

直到表达能够承担相应责任。

当表达无法继续运行时：

勿问留下不可回避的问题。

等待新的证词。

等待下一次诚实运行。
