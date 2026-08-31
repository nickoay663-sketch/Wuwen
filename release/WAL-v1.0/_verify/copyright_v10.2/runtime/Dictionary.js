const Dictionary = {

    version: "3.0",

    categories: [

        "person",

        "profession",

        "identity",

        "family",

        "organization",

        "rule",

        "concept"

    ],

    objects: [

        {
            id: "object.self",
            word: "我",
            type: "person"
        },

        {
            id: "object.you",
            word: "你",
            type: "person"
        },

        {
            id: "object.he",
            word: "他",
            type: "person"
        },

        {
            id: "object.she",
            word: "她",
            type: "person"
        }

    ],

    concepts: [

        {
            id: "concept.teacher",
            word: "老师",
            category: "profession"
        },

        {
            id: "concept.doctor",
            word: "医生",
            category: "profession"
        },

        {
            id: "concept.student",
            word: "学生",
            category: "identity"
        },

        {
            id: "concept.father",
            word: "父亲",
            category: "family"
        },

        {
            id: "concept.mother",
            word: "母亲",
            category: "family"
        },

        {
            id: "concept.country",
            word: "国家",
            category: "organization"
        },

        {
            id: "concept.government",
            word: "政府",
            category: "organization"
        },

        {
            id: "concept.law",
            word: "法律",
            category: "rule"
        },

        {
            id: "concept.freedom",
            word: "自由",
            category: "concept"
        },

        {
            id: "concept.truth",
            word: "真相",
            category: "concept"
        },

        {
            id: "concept.evidence",
            word: "证据",
            category: "concept"
        },

        {
            id: "concept.testimony",
            word: "证词",
            category: "concept"
        },

        {
            id: "concept.responsibility",
            word: "责任",
            category: "concept"
        },

        {
            id: "concept.definition",
            word: "定义",
            category: "concept"
        },

        {
            id: "concept.correspondence",
            word: "对应",
            category: "concept"
        },

        {
            id: "concept.reasoning",
            word: "推理",
            category: "concept"
        }

    ]

};

export default Dictionary;
