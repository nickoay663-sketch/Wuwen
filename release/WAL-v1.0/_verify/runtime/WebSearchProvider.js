class WebSearchProvider {

    constructor(options = {}) {

        this.name =
            options.name ||
            "DuckDuckGoWebSearchProvider";

        this.version =
            "2.3";

        this.endpoint =
            options.endpoint ||
            "https://html.duckduckgo.com/html/";

        this.count =
            Number.isInteger(options.count) &&
                options.count > 0
                ? Math.min(options.count, 20)
                : 10;

    }


    async search(query) {

        const normalizedQuery =
            typeof query === "string"
                ? query.trim()
                : "";


        if (!normalizedQuery) {

            return {
                status: "search-empty",
                query: "",
                sources: []
            };

        }


        const params =
            new URLSearchParams({
                q: normalizedQuery
            });


        const url =
            `${this.endpoint}?${params.toString()}`;


        let response;

        try {

            response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        headers: {
                            "Accept":
                                "text/html,application/xhtml+xml",

                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Wuwen/10.4"
                        }
                    }
                );

        } catch (error) {

            return {
                status: "provider-error",
                query: normalizedQuery,
                sources: [],
                error:
                    error && error.message
                        ? error.message
                        : String(error)
            };

        }


        if (!response.ok) {

            return {
                status: "provider-error",
                query: normalizedQuery,
                sources: [],
                error:
                    `DuckDuckGo returned HTTP ${response.status}.`
            };

        }


        let html;

        try {

            html =
                await response.text();

        } catch (error) {

            return {
                status: "provider-error",
                query: normalizedQuery,
                sources: [],
                error:
                    error && error.message
                        ? error.message
                        : String(error)
            };

        }


        const sources =
            this.parseResults(html)
                .slice(0, this.count);


        return {
            status:
                sources.length > 0
                    ? "search-completed"
                    : "search-empty",

            query:
                normalizedQuery,

            sources
        };

    }


    parseResults(html) {

        if (
            typeof html !== "string" ||
            html.length === 0
        ) {

            return [];

        }


        const results = [];

        /*
         * ---------------------------------------------------------
         * DuckDuckGo HTML parser
         *
         * Search Provider 只负责发现来源。
         *
         * 不创建 Evidence。
         * 不执行 Verification。
         * 不支持 Claim。
         * 不生成 Conclusion。
         * ---------------------------------------------------------
         */

        const anchorPattern =
            /<a[^>]*class=["'][^"']*\bresult__a\b[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;


        const anchors = [];

        let match;


        while (
            (match =
                anchorPattern.exec(html)) !== null
        ) {

            anchors.push({

                index:
                    match.index,

                end:
                    anchorPattern.lastIndex,

                rawUrl:
                    match[1],

                rawTitle:
                    match[2]

            });

        }


        for (
            let i = 0;
            i < anchors.length;
            i++
        ) {

            const anchor =
                anchors[i];


            const nextAnchor =
                anchors[i + 1];


            const segmentEnd =
                nextAnchor
                    ? nextAnchor.index
                    : html.length;


            const segment =
                html.slice(
                    anchor.end,
                    segmentEnd
                );


            const rawUrl =
                this.decodeHtml(
                    anchor.rawUrl
                );


            const title =
                this.cleanText(
                    anchor.rawTitle
                );


            const snippetMatch =
                segment.match(
                    /<a[^>]*class=["'][^"']*\bresult__snippet\b[^"']*["'][^>]*>([\s\S]*?)<\/a>/i
                ) ||
                segment.match(
                    /<div[^>]*class=["'][^"']*\bresult__snippet\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
                );


            const description =
                snippetMatch
                    ? this.cleanText(
                        snippetMatch[1]
                    )
                    : "";


            const url =
                this.extractRealUrl(
                    rawUrl
                );


            if (
                !url ||
                !title ||
                !description
            ) {

                continue;

            }


            const sourceName =
                this.extractSourceName(
                    url
                );


            results.push({

                source:
                    sourceName ||
                    url,

                url,

                title,

                publisher:
                    sourceName ||
                    null,

                publishedTime:
                    null,

                content:
                    description,

                type:
                    "web-search",

                state:
                    "DISCOVERED",

                verificationStatus:
                    "UNVERIFIED",

                epistemicState:
                    "DISCOVERED",

                verified:
                    false,

                verificationBasis:
                    null,

                verificationSource:
                    null,

                verifier:
                    null,

                supportsClaim:
                    false,

                independent:
                    true

            });

        }


        return results;

    }


    extractRealUrl(url) {

        if (
            typeof url !== "string"
        ) {

            return null;

        }


        let normalized =
            this.decodeHtml(
                url
            ).trim();


        if (!normalized) {

            return null;

        }


        if (
            normalized.startsWith("//")
        ) {

            normalized =
                `https:${normalized}`;

        }


        /*
         * ---------------------------------------------------------
         * DuckDuckGo Redirect Normalization
         *
         * 优先识别 uddg 参数。
         *
         * 不依赖：
         *
         * hostname === "duckduckgo.com"
         * pathname === "/l/"
         *
         * 因为不同 DuckDuckGo 页面/入口可能产生不同
         * redirect host 或 path。
         *
         * ---------------------------------------------------------
         */

        try {

            const parsed =
                new URL(
                    normalized,
                    "https://html.duckduckgo.com"
                );


            const redirected =
                parsed.searchParams.get(
                    "uddg"
                );


            if (redirected) {

                let decoded =
                    redirected;


                try {

                    decoded =
                        decodeURIComponent(
                            decoded
                        );

                } catch {

                    decoded =
                        redirected;

                }


                if (
                    typeof decoded === "string" &&
                    decoded.trim()
                ) {

                    const target =
                        decoded.trim();


                    if (
                        target.startsWith(
                            "http://"
                        ) ||
                        target.startsWith(
                            "https://"
                        )
                    ) {

                        return target;

                    }

                }

            }


            return parsed.href;

        } catch {

            return null;

        }

    }


    extractSourceName(url) {

        try {

            const parsed =
                new URL(url);


            return parsed.hostname
                .replace(
                    /^www\./,
                    ""
                );

        } catch {

            return null;

        }

    }


    cleanText(value) {

        if (
            typeof value !== "string"
        ) {

            return "";

        }


        return this.decodeHtml(value)
            .replace(
                /<[^>]*>/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    decodeHtml(value) {

        if (
            typeof value !== "string"
        ) {

            return "";

        }


        return value
            .replace(
                /&amp;/gi,
                "&"
            )
            .replace(
                /&quot;/gi,
                '"'
            )
            .replace(
                /&#39;|&apos;/gi,
                "'"
            )
            .replace(
                /&lt;/gi,
                "<"
            )
            .replace(
                /&gt;/gi,
                ">"
            )
            .replace(
                /&#(\d+);/g,
                (_, code) => {

                    const number =
                        Number(code);

                    return Number.isInteger(number) &&
                        number >= 0 &&
                        number <= 0x10FFFF
                        ? String.fromCodePoint(number)
                        : "";

                }
            )
            .replace(
                /&#x([0-9a-f]+);/gi,
                (_, code) => {

                    const number =
                        parseInt(
                            code,
                            16
                        );

                    return Number.isInteger(number) &&
                        number >= 0 &&
                        number <= 0x10FFFF
                        ? String.fromCodePoint(number)
                        : "";

                }
            );

    }

}


export default WebSearchProvider;
