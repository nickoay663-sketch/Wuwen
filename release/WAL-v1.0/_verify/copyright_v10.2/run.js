import HonestRuntime from "./runtime/HonestRuntime.js";
import ReportFormatter from "./runtime/ReportFormatter.js";


const input =

    process.argv
        .slice(2)
        .join(" ")
    ||

    "请输入需要检查的表达。";



const expression = {


    content:

        input,


    type:

        "text"

};



const runtime =

    new HonestRuntime(

        expression.content

    );



const result =

    runtime.run();



const report =

    new ReportFormatter(result)

        .run();



console.log(

    JSON.stringify(

        report,

        null,

        2

    )

);
