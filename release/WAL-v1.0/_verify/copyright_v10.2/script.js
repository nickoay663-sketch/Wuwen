
function verifyLanguage() {

    let text = document.getElementById("inputText").value;

    let result = "";

    if (text.trim() == "") {

        result = "<h3>勿问</h3>";

        result += "<p>欢迎回来。</p>";
        result += "<p>回到诚实。</p>";
        result += "<p>文明开始的地方。</p>";

    } else {

        result = "<h3>勿问</h3>";

        result += "<p><strong>正在诚实运行……</strong></p>";
        result += "<hr>";

        result += "<p><strong>输入：</strong></p>";
        result += "<blockquote>" + text + "</blockquote>";

        result += "<hr>";

        result += "<p>① 概念（运行中）</p>";
        result += "<p>② 对象（运行中）</p>";
        result += "<p>③ 定义（运行中）</p>";
        result += "<p>④ 证词（运行中）</p>";
        result += "<p>⑤ 对应（运行中）</p>";
        result += "<p>⑥ 承担（运行中）</p>";

        result += "<hr>";

        result += "<p><strong>勿问只是诚实运行，没有别的。</strong></p>";

    }

    document.getElementById("result").innerHTML = result;

}
