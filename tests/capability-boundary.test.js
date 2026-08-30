import HonestRuntime from "../runtime/HonestRuntime.js";

const cases = [

    {
        name:
            "DISABLED_ADAPTER",

        expectedAdmission:
            "REJECT",

        expectedExternalSources:
            0,

        options: {

            externalSearchAdapter: {
                enabled: false
            }

        }

    },

    {
        name:
            "NO_PROVIDER",

        expectedAdmission:
            "REJECT",

        expectedExternalSources:
            0,

        options: {

            externalSearchAdapter: {
                enabled: true
            }

        }

    },

    {
        name:
            "EMPTY_PROVIDER",

        expectedAdmission:
            "PASS",

        expectedExternalSources:
            0,

        options: {

            externalSearchAdapter: {

                enabled:
                    true,

                provider:
                    async () => ({

                        sources:
                            []

                    })

            }

        }

    },

    {
        name:
            "REAL_PROVIDER",

        expectedAdmission:
            "PASS",

        expectedExternalSources:
            1,

        options: {

            externalSearchAdapter: {

                enabled:
                    true,

                provider:
                    async () => ({

                        sources: [

                            {

                                source:
                                    "TestProvider",

                                url:
                                    "https://example.com/test-evidence",

                                title:
                                    "Capability Boundary Test",

                                publisher:
                                    "TestProvider",

                                content:
                                    "这是由外部 Capability Provider 返回的测试来源内容。",

                                type:
                                    "external",

                                independent:
                                    true

                            }

                        ]

                    })

            }

        }

    }

];


for (const testCase of cases) {

    const runtime =
        new HonestRuntime(

            "测试 Capability 边界",

            testCase.options

        );


    const result =
        await runtime.run();


    const search =
        result.search || {};


    const sources =
        Array.isArray(search.sources)
            ? search.sources
            : [];


    const externalSources =
        sources.filter(

            source =>
                source.source !==
                "RuntimeInput"

        );


    const externalSourceBoundaryValid =
        externalSources.every(

            source =>

                source.state ===
                "DISCOVERED" &&

                source.verificationStatus ===
                "UNVERIFIED" &&

                source.epistemicState ===
                "DISCOVERED" &&

                source.verified ===
                false &&

                source.supportsClaim ===
                false

        );


    const evidenceBoundaryValid =

        search.metadata?.evidenceCreated !==
        true &&

        search.result?.evidenceCreated !==
        true;


    const capabilityAdmissionValid =

        search.capabilityAdmission ===
        testCase.expectedAdmission;


    const externalSourceCountValid =

        externalSources.length ===
        testCase.expectedExternalSources;


    const selfCheckPassed =
        result.selfCheck?.passed === true;


    const boundaryPassed =
        result.selfCheck?.boundaryReport?.passed === true;


    const epistemicPassed =
        result.selfCheck?.epistemicReport?.passed === true;


    const passed =

        capabilityAdmissionValid &&

        externalSourceCountValid &&

        externalSourceBoundaryValid &&

        evidenceBoundaryValid &&

        selfCheckPassed &&

        boundaryPassed &&

        epistemicPassed;


    console.log(

        JSON.stringify(

            {

                name:
                    testCase.name,

                passed,

                expected: {

                    capabilityAdmission:
                        testCase.expectedAdmission,

                    externalSourceCount:
                        testCase.expectedExternalSources

                },

                actual: {

                    capabilityAdmission:
                        search.capabilityAdmission,

                    externalSourceCount:
                        externalSources.length

                },

                search: {

                    status:
                        search.status,

                    sourceCount:
                        search.metadata?.sourceCount,

                    evidenceCreated:
                        search.metadata?.evidenceCreated

                },

                externalSources:

                    externalSources.map(

                        source => ({

                            source:
                                source.source,

                            state:
                                source.state,

                            verificationStatus:
                                source.verificationStatus,

                            epistemicState:
                                source.epistemicState,

                            verified:
                                source.verified,

                            supportsClaim:
                                source.supportsClaim,

                            independent:
                                source.independent

                        })

                    ),

                boundaryAssertions: {

                    capabilityAdmission:
                        capabilityAdmissionValid,

                    externalSourceCount:
                        externalSourceCountValid,

                    externalSourceBoundary:
                        externalSourceBoundaryValid,

                    evidenceBoundary:
                        evidenceBoundaryValid

                },

                selfCheck: {

                    passed:
                        selfCheckPassed,

                    engines:
                        result.selfCheck?.checks?.engines,

                    pipeline:
                        result.selfCheck?.checks?.pipeline,

                    boundary:
                        result.selfCheck?.boundaryReport,

                    epistemic:
                        result.selfCheck?.epistemicReport

                }

            },

            null,

            2

        )

    );


    if (!passed) {

        throw new Error(

            `Capability boundary test failed: ${testCase.name}`

        );

    }

}


console.log(
    "\nCapability Boundary Test Passed."
);
