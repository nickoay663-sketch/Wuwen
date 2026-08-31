async function verifyLanguage() {

    const input =
        document.getElementById("inputText");

    const resultBox =
        document.getElementById("result");

    const text =
        input.value.trim();

    if (!text) {

        resultBox.innerHTML = `
            <h3>勿问</h3>
            <p>欢迎回来。</p>
            <p>回到诚实。</p>
            <p>文明开始的地方。</p>
        `;

        return;
    }

    resultBox.innerHTML = `
        <h3>勿问</h3>
        <p><strong>正在诚实运行……</strong></p>
    `;

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8787/v1/responsibility/check",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            expression: text
                        })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Runtime Error"
            );

        }

        const report =
            data.report || {};

        const sections = [
            ["Recognition", report.recognition],
            ["Definition", report.definition],
            ["Testimony", report.testimony],
            ["Testimony Validation", report.testimonyValidation],
            ["Search", report.search],
            ["Evidence", report.evidence],
            ["Correspondence", report.correspondence],
            ["Reasoning", report.reasoning],
            ["Responsibility", report.responsibility],
            ["Reconstruction", report.reconstruction],
            ["Generator", report.generator],
            ["SelfCheck", report.selfCheck]
        ];

        let sectionsHtml = "";

        for (
            const [name, value]
            of sections
        ) {

            sectionsHtml += `
                <details>
                    <summary>
                        <strong>${escapeHtml(name)}</strong>
                    </summary>

                    <pre>${escapeHtml(
                        JSON.stringify(
                            value ?? {},
                            null,
                            2
                        )
                    )}</pre>

                </details>
            `;

        }

        resultBox.innerHTML = `

            <h3>勿问</h3>

            <p>
                <strong>
                    Runtime 已完成运行
                </strong>
            </p>

            <hr>

            <p>
                <strong>输入：</strong>
            </p>

            <blockquote>
                ${escapeHtml(text)}
            </blockquote>

            <hr>

            <p>
                <strong>运行状态：</strong>
                ${escapeHtml(
                    data.status || "unknown"
                )}
            </p>

            <p>
                <strong>Runtime：</strong>
                ${escapeHtml(
                    data.version || "unknown"
                )}
            </p>

            <p>
                <strong>认识状态：</strong>
                ${escapeHtml(
                    report.epistemicState || "UNKNOWN"
                )}
            </p>

            <hr>

            ${sectionsHtml}

            <hr>

            <p>
                <strong>
                    勿问只是诚实运行，没有别的。
                </strong>
            </p>

        `;

    } catch (error) {

        resultBox.innerHTML = `

            <h3>勿问</h3>

            <p>
                <strong>
                    Runtime 未能完成运行。
                </strong>
            </p>

            <hr>

            <p>
                ${escapeHtml(
                    error.message
                )}
            </p>

        `;

    }

}


function escapeHtml(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}
