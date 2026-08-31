class LanguageDetector {

    constructor(text) {

        this.text = (text || "").trim();

    }

    run() {

        return {

            language: this.detect(),

            status: "completed",

            version: "1.1"

        };

    }

    detect() {

        if (/[\u4e00-\u9fff]/.test(this.text)) {

            return "zh-CN";

        }

        if (/[áéíóúñü¿¡]/i.test(this.text)) {

            return "es-ES";

        }

        const lower = this.text.toLowerCase();

        const spanishWords = [

            " el ",
            " la ",
            " los ",
            " las ",
            " un ",
            " una ",
            " de ",
            " del ",
            " que ",
            " verdad ",
            " evidencia ",
            " profesor ",
            " responsabilidad ",
            " necesita ",
            " tiene "

        ];

        if (
            spanishWords.some(
                word => (" " + lower + " ").includes(word)
            )
        ) {

            return "es-ES";

        }

        if (/[a-z]/i.test(this.text)) {

            return "en-US";

        }

        return "unknown";

    }

}

export default LanguageDetector;
