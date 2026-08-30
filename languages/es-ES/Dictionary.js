const Dictionary = {
    version: "1.0",
    language: "es-ES",

    objects: [
        {
            id: "object.self",
            word: "yo",
            aliases: ["yo", "me"],
            type: "person"
        },
        {
            id: "object.you",
            word: "tú",
            aliases: ["tú", "usted", "ustedes"],
            type: "person"
        },
        {
            id: "object.he",
            word: "él",
            aliases: ["él"],
            type: "person"
        },
        {
            id: "object.she",
            word: "ella",
            aliases: ["ella"],
            type: "person"
        },
        {
            id: "object.government",
            word: "gobierno",
            aliases: ["gobierno"],
            type: "organization"
        },
        {
            id: "object.country",
            word: "país",
            aliases: ["país", "nación"],
            type: "organization"
        }
    ],

    concepts: [
        {
            id: "concept.teacher",
            word: "profesor",
            aliases: ["profesor", "profesora", "docente"],
            category: "profession"
        },
        {
            id: "concept.doctor",
            word: "médico",
            aliases: ["médico", "médica", "doctor", "doctora"],
            category: "profession"
        },
        {
            id: "concept.student",
            word: "estudiante",
            aliases: ["estudiante", "alumno", "alumna"],
            category: "identity"
        },
        {
            id: "concept.father",
            word: "padre",
            aliases: ["padre"],
            category: "family"
        },
        {
            id: "concept.mother",
            word: "madre",
            aliases: ["madre"],
            category: "family"
        },
        {
            id: "concept.truth",
            word: "verdad",
            aliases: ["verdad"],
            category: "concept"
        },
        {
            id: "concept.evidence",
            word: "evidencia",
            aliases: ["evidencia", "prueba"],
            category: "concept"
        },
        {
            id: "concept.testimony",
            word: "testimonio",
            aliases: ["testimonio", "declaración"],
            category: "concept"
        },
        {
            id: "concept.responsibility",
            word: "responsabilidad",
            aliases: ["responsabilidad"],
            category: "concept"
        },
        {
            id: "concept.justice",
            word: "justicia",
            aliases: ["justicia"],
            category: "concept"
        },
        {
            id: "concept.freedom",
            word: "libertad",
            aliases: ["libertad"],
            category: "concept"
        },
        {
            id: "concept.law",
            word: "ley",
            aliases: ["ley", "leyes"],
            category: "rule"
        }
    ]
};

export default Dictionary;
