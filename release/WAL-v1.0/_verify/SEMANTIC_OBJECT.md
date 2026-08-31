# Semantic Object v1.1

# 勿问统一语义对象 v1.1


## Purpose

Semantic Object is the unified runtime object of Wuwen.

Every expression entering Honest Runtime shall be converted into one Semantic Object.

统一语义对象是勿问的统一运行对象。

所有进入诚实运行的表达，都必须转换为统一语义对象。


---

# Core Principle

Natural language is not the final runtime object.

Semantic Object is the runtime object.

However, Semantic Object must preserve the original language environment and responsibility of expression.


自然语言不是最终运行对象。

统一语义对象才是运行对象。

但是，统一语义对象必须保留原始语言环境和表达责任。


---

# Runtime Position


Input Expression

↓

Language Runtime

↓

Expression Engine

↓

Semantic Object

↓

Honest Runtime

↓

Reconstruction

↓

Output


输入表达

↓

语言运行系统

↓

表达引擎

↓

统一语义对象

↓

诚实运行

↓

重构

↓

输出


---

# Semantic Object Structure


A Semantic Object contains:


```json
{
 "originalContent":"",
 "language":"",
 "languageEnvironment":"",
 "expressionType":"",
 "subject":"",
 "object":"",
 "concept":"",
 "definition":"",
 "semanticStructure":"",
 "context":"",
 "evidenceState":"",
 "responsibility":"",
 "runtimeStatus":""
}
