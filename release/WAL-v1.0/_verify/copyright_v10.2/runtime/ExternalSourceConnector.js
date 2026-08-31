class ExternalSourceConnector {


    constructor(searchRequest) {

        this.searchRequest = searchRequest || {};

    }



    run() {


        const sources =

            this.collectSources();



        return {


            principle:

                "勿问连接外部来源，但不把来源内容直接视为证据。",



            sources,



            result: {

                sources

            },



            trace: [],



            nextRuntimeState:

                "EvidenceEngine",



            status:

                sources.length > 0

                    ? "source-connected"

                    : "need-source",



            version:

                "3.8"


        };

    }





    collectSources() {


        const keyword =

            this.searchRequest.keyword || "";



        return [


            {


                keyword,



                source:

                    null,



                title:

                    null,



                url:

                    null,



                publisher:

                    null,



                publishedTime:

                    null,



                content:

                    null,



                verificationStatus:

                    "pending"


            }


        ];

    }


}


export default ExternalSourceConnector;
