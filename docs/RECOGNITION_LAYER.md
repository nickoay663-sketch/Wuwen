Wuwen Recognition Layer Specification

Version: 1.0

Status: Frozen

Mission

Recognition Layer 是勿问 Runtime 的唯一入口。

任何输入必须首先进入 Recognition Layer。

Recognition Layer 的职责不是判断真假，而是识别证词。

Supported Testimony

Recognition Layer 支持以下证词类型：

- Text
- Audio
- Video
- Image
- Document

未来新增证词类型，不影响 Runtime 架构。

Responsibilities

Recognition Layer 只负责：

1. 识别证词类型（Testimony Type）
2. 提取证词内容（Testimony Extraction）
3. 识别文字系统（Script）
4. 识别语言（Language）
5. 识别对象（Objects）
6. 识别概念（Concepts）
7. 输出统一的 semanticObject

Prohibitions

Recognition Layer 不得：

- 判断真假
- 建立定义
- 搜索资料
- 建立证据
- 推理
- 判断责任
- 重构结论

这些职责全部属于后续 Runtime。

Language Principle

Language 只允许识别一次。

Recognition Layer 输出的 language 为整个 Runtime 的唯一语言上下文。

任何后续 Engine 不得再次识别语言。

Output

Recognition Layer 必须输出统一的 semanticObject。

Runtime 后续所有 Engine 只能接收 semanticObject，不直接处理原始输入。

Architecture Principle

任何形式的输入，最终都必须转换为统一证词。

Runtime 检查的是证词，而不是输入媒介。

Constitutional Principle

没有完成 Recognition，不得进入 Runtime 下一阶段。

Recognition Layer 为勿问 Runtime 宪法级基础层。
