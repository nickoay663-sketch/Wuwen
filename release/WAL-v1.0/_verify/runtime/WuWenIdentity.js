import WuwenConfig from "./WuwenConfig.js";


class WuwenIdentity {


    run() {


        return {


            version:

                "2.2",



            name:

                WuwenConfig.name,



            identity:

                WuwenConfig.identity,



            motto:

                WuwenConfig.motto,



            principle:

                WuwenConfig.principles,



            mission:

                WuwenConfig.mission,



            coreRule:

                "勿问处理表达，不判断人；检验责任，不替代判断。",



            languagePrinciple:

                "语言是入口，表达责任是运行对象。",



            status:

                "active"


        };


    }


}


export default WuwenIdentity;
