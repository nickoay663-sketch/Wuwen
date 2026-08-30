class UniversalExpression {

    constructor(data = {}) {

        this.subject =
            data.subject ?? null;

        this.predicate =
            data.predicate ?? null;

        this.object =
            data.object ?? null;

        this.attributes =
            Array.isArray(data.attributes)
                ? data.attributes
                : [];

        this.relation =
            Array.isArray(data.relation)
                ? data.relation
                : [];

        this.modality =
            data.modality ?? null;

        this.quantity =
            data.quantity ?? null;

        this.time =
            data.time ?? null;

        this.condition =
            data.condition ?? null;

        this.originalExpression =
            typeof data.originalExpression === "string"
                ? data.originalExpression
                : "";

        /*
         * External language system.
         *
         * Wuwen does not identify,
         * interpret, construct, or own it.
         *
         * The supplied system is preserved
         * as-is across the runtime boundary.
         */

        this.sourceLanguage =
            data.sourceLanguage ??
            null;

    }


    static from(data = {}) {

        return new UniversalExpression(
            data
        );

    }


    toJSON() {

        return {

            subject:
                this.subject,

            predicate:
                this.predicate,

            object:
                this.object,

            attributes:
                this.attributes,

            relation:
                this.relation,

            modality:
                this.modality,

            quantity:
                this.quantity,

            time:
                this.time,

            condition:
                this.condition,

            originalExpression:
                this.originalExpression,

            sourceLanguage:
                this.sourceLanguage

        };

    }


    hasSubject() {

        return this.subject !== null;

    }


    hasPredicate() {

        return this.predicate !== null;

    }


    hasObject() {

        return this.object !== null;

    }


    hasOriginalExpression() {

        return (
            this.originalExpression.length > 0
        );

    }


    hasSourceLanguage() {

        return (
            this.sourceLanguage !== null &&
            this.sourceLanguage !== undefined
        );

    }


    isComplete() {

        return (
            this.hasSubject() &&
            this.hasPredicate()
        );

    }


    isEmpty() {

        return (
            !this.hasSubject() &&
            !this.hasPredicate() &&
            !this.hasObject() &&
            this.attributes.length === 0 &&
            this.relation.length === 0 &&
            this.modality === null &&
            this.quantity === null &&
            this.time === null &&
            this.condition === null &&
            !this.hasOriginalExpression()
        );

    }


    clone() {

        return UniversalExpression.from(
            this.toJSON()
        );

    }


    withOriginalExpression(
        expression
    ) {

        return UniversalExpression.from({

            ...this.toJSON(),

            originalExpression:
                typeof expression === "string"
                    ? expression
                    : ""

        });

    }


    withSourceLanguage(
        languageSystem
    ) {

        return UniversalExpression.from({

            ...this.toJSON(),

            sourceLanguage:
                languageSystem ??
                null

        });

    }


    static empty(
        originalExpression = "",
        sourceLanguage = null
    ) {

        return new UniversalExpression({

            originalExpression,

            sourceLanguage

        });

    }

}


export default UniversalExpression;
