class LanguageAdapter {

    constructor(languageSystem = null) {

        /*
         * External Language Boundary
         *
         * The language system is supplied from outside Wuwen.
         *
         * Wuwen does not:
         *
         * - identify the language system
         * - interpret the language system
         * - construct the language system
         * - translate the language system
         * - modify the language system
         * - own the language system
         *
         * The adapter only carries the supplied system
         * across the Runtime boundary.
         */

        this.languageSystem =
            languageSystem !== null &&
                languageSystem !== undefined
                ? languageSystem
                : null;

    }


    connect(expression) {

        const text =
            typeof expression === "string"
                ? expression.trim()
                : String(expression ?? "").trim();

        const connected =
            this.languageSystem !== null &&
            this.languageSystem !== undefined;

        return {

            expression:
                text,

            languageSystem:
                this.languageSystem,

            connected,

            externallySupplied:
                connected,

            status:
                connected
                    ? "connected"
                    : "not-supplied"

        };

    }


    adapt(expression) {

        return this.connect(
            expression
        );

    }


    getLanguageSystem() {

        return this.languageSystem;

    }


    isConnected() {

        return (
            this.languageSystem !== null &&
            this.languageSystem !== undefined
        );

    }

}


export default LanguageAdapter;
