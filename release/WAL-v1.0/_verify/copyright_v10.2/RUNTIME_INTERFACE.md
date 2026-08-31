# Runtime Interface v1.1

# 勿问运行接口规范 v1.1


## Purpose

Runtime Interface defines the common interface shared by every Runtime in Wuwen.

Every Runtime follows the same interface specification while maintaining different responsibilities.

运行接口规范定义勿问所有 Runtime 共同遵循的接口。

所有 Runtime 遵循统一接口，同时保持各自责任。


---

## Principle

Different Runtime.

Same Interface.

Different Responsibilities.

Same Constitution.


不同运行系统。

统一接口。

不同责任。

同一宪法。


---

## Runtime Lifecycle

Receive

↓

Verify

↓

Execute

↓

Generate Result

↓

Return


所有运行系统遵循统一生命周期。


---

## Input

Every Runtime receives a Structured Expression Object created by Language Runtime.

自然语言通过 Language Runtime 进入勿问。

Runtime 接收由语言运行系统建立的结构化表达对象。


Input Object includes:

- Original Expression
- Language Environment
- Expression Structure
- Semantic Information


输入对象包含：

- 原始表达
- 语言证词环境
- 表达结构
- 语义信息


---

## Processing

Runtime processes the Structured Expression Object according to its responsibility.

Each Runtime may use different methods.

However, every Runtime must remain consistent with Wuwen Constitution.


运行系统依据自身责任处理结构化表达对象。

不同运行系统可以采用不同方法。

但必须遵循《勿问宪法》。


---

## Output

Every Runtime returns one Runtime Result.

The Runtime Result shall include:

- Language Environment
- Processed Expression Object
- Runtime Status
- Questions
- Suggestions
- Responsibility Information


每个运行系统必须输出统一运行结果。

运行结果至少包含：

- 语言运行环境
- 处理后的表达对象
- 运行状态
- 问题
- 建议
- 责任信息


---

## Error Handling

Runtime shall never fabricate results.

If execution cannot continue,

Runtime shall stop and report the reason.


运行系统不得编造结果。

无法继续运行时，

必须停止并说明原因。


---

## Responsibility

Every Runtime shall clearly define its responsibility.

No Runtime may execute beyond its responsibility.


每个 Runtime 必须明确自身责任。

不得越权运行。


---

## Goal

One Interface.

Many Runtime.

One Constitution.

One Honest Principle.


统一接口。

多个 Runtime。

同一部宪法。

同一诚实原则。
