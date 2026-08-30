from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.units import mm
from pypdf import PdfReader
import hashlib
import sys

OUT = Path(r"C:\Users\ABC\Desktop\copyright\_v10.2\01_版本与创作证据_三语.pdf")

pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))

title = ParagraphStyle(
    "Title",
    fontName="STSong-Light",
    fontSize=18,
    leading=25,
    spaceAfter=14,
)

heading = ParagraphStyle(
    "Heading",
    fontName="STSong-Light",
    fontSize=13,
    leading=19,
    spaceBefore=10,
    spaceAfter=7,
)

body = ParagraphStyle(
    "Body",
    fontName="STSong-Light",
    fontSize=10,
    leading=16,
    spaceAfter=9,
)

story = []

story.append(Paragraph(
    "01 版本与创作证据 / Version and Creation Evidence / Evidencia de versión y creación",
    title
))

sections = [
    (
        "中文",
        """
        <b>作品名称：</b>勿问（WuWen）运行时系统。<br/>
        <b>版本：</b>v10.2。<br/><br/>

        本文件用于记录勿问运行时系统的版本与创作证据。
        本版本对应 WuWen Runtime v10.2，并与源代码归档、Git 版本信息及完整性核验材料建立对应关系。<br/><br/>

        勿问的核心原则是：运行时不生成意见。
        运行时执行诚实的验证过程，每一个输出都必须能够由其自身的责任链承担。
        运行时不得在现有证据链之外制造证据，也不得在已经验证的责任链之外制造结论。<br/><br/>

        本文件中的版本信息用于版本识别，不应被理解为对尚未实际核验的数据作出确认。
        """
    ),
    (
        "English",
        """
        <b>Work:</b> WuWen Runtime System.<br/>
        <b>Version:</b> v10.2.<br/><br/>

        This document records the version and creation evidence of the WuWen Runtime System.
        This version corresponds to WuWen Runtime v10.2 and is intended to correspond with the source archive,
        Git version information, and integrity verification materials.<br/><br/>

        The core principle of WuWen is: the runtime does not generate opinions.
        The runtime performs an honest verification process, and every output must be bearable by its own responsibility chain.
        The runtime does not create evidence outside the available evidence chain and does not create conclusions outside the verified responsibility chain.<br/><br/>

        Version information in this document is provided for version identification.
        It must not be interpreted as verification of data that has not actually been verified.
        """
    ),
    (
        "Español",
        """
        <b>Obra:</b> Sistema de ejecución WuWen.<br/>
        <b>Versión:</b> v10.2.<br/><br/>

        Este documento registra la versión y la evidencia de creación del sistema de ejecución WuWen.
        Esta versión corresponde a WuWen Runtime v10.2 y está destinada a corresponder con el archivo de código fuente,
        la información de versión de Git y los materiales de verificación de integridad.<br/><br/>

        El principio fundamental de WuWen es: el runtime no genera opiniones.
        El runtime realiza un proceso honesto de verificación y cada salida debe poder ser asumida por su propia cadena de responsabilidad.
        El runtime no crea evidencia fuera de la cadena de evidencia disponible ni conclusiones fuera de la cadena de responsabilidad verificada.<br/><br/>

        La información de versión de este documento se proporciona para identificar la versión.
        No debe interpretarse como una verificación de datos que todavía no hayan sido verificados realmente.
        """
    ),
]

for lang, text in sections:
    story.append(Paragraph(lang, heading))
    story.append(Paragraph(text, body))

doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=18*mm,
    rightMargin=18*mm,
    topMargin=18*mm,
    bottomMargin=18*mm,
)

doc.build(story)

# ============================================================
# 自动核验
# ============================================================

if not OUT.exists():
    print("FAIL: PDF 文件没有生成")
    sys.exit(1)

size = OUT.stat().st_size
sha256 = hashlib.sha256(OUT.read_bytes()).hexdigest()

reader = PdfReader(str(OUT))
text = "\n".join((page.extract_text() or "") for page in reader.pages)

required = ["中文", "English", "Español", "勿问", "WuWen", "v10.2"]

missing = [x for x in required if x not in text]

print()
print("========================================")
print("WuWen 01 三语 PDF 自动核验")
print("========================================")
print(f"文件：{OUT}")
print(f"大小：{size} bytes")
print(f"页数：{len(reader.pages)}")
print(f"SHA-256：{sha256}")
print(f"抽取文字长度：{len(text)}")

if missing:
    print()
    print("FAIL：缺少以下文字：")
    for x in missing:
        print(f"  - {x}")
    sys.exit(1)

if len(text.strip()) < 100:
    print("FAIL：PDF 文字内容异常短，疑似空白")
    sys.exit(1)

print()
print("PASS：中文存在")
print("PASS：English 存在")
print("PASS：Español 存在")
print("PASS：WuWen 存在")
print("PASS：v10.2 存在")
print("PASS：PDF 存在实际文字")
print()
print("========================================")
print("01 PDF 生成及文字核验 PASS")
print("========================================")
