# Wuwen Engine Interface v3.0

# 勿问运行引擎接口 v3.0

---

# Purpose

Engine Interface defines the common execution standard for all Engines.

Every Engine follows the same interface.

运行引擎接口规定所有 Engine 的统一执行规范。

所有 Engine 必须遵循同一个接口。

---

# Standard Interface

Input

↓

Verify

↓

Process

↓

Output

任何 Engine 都必须遵循：

输入

↓

检验

↓

处理

↓

输出

---

# Required Input

Every Engine receives:

- Runtime Context
- Current Testimony
- Previous Runtime Result

每个 Engine 接收：

- 运行上下文
- 当前证词
- 上一步运行结果

---

# Required Output

Every Engine returns:

- Status
- Result
- Trace
- Next Runtime State

每个 Engine 输出：

- 状态
- 结果
- 追溯记录
- 下一运行状态

---

# Failure Handling

When verification fails,

Engine never fabricates results.

Engine returns Runtime Failure.

当检验失败时，

Engine 不制造结果。

直接返回运行失败。

---

# Core Principle

Different Engines.

One Interface.

不同 Engine。

统一接口。
