import http from "node:http";

import WuwenRuntime from "../index.js";


const HOST =
    "127.0.0.1";

const PORT =
    Number(
        process.env.Wuwen_API_PORT ||
        8787
    );


function sendJson(
    response,
    statusCode,
    payload
) {

    const body =
        JSON.stringify(
            payload
        );

    response.writeHead(
        statusCode,
        {
            "Content-Type":
                "application/json; charset=utf-8",

            "Content-Length":
                Buffer.byteLength(
                    body,
                    "utf8"
                ),

            "Access-Control-Allow-Origin":
                "*",

            "Access-Control-Allow-Methods":
                "GET, POST, OPTIONS",

            "Access-Control-Allow-Headers":
                "Content-Type"
        }
    );

    response.end(
        body
    );

}


async function readJson(
    request
) {

    const chunks = [];

    for await (
        const chunk of request
    ) {

        chunks.push(
            chunk
        );

    }

    const body =
        Buffer
            .concat(chunks)
            .toString("utf8")
            .trim();

    if (!body) {

        return {};

    }

    return JSON.parse(
        body
    );

}


async function handleCheck(
    request,
    response
) {

    let payload;

    try {

        payload =
            await readJson(
                request
            );

    } catch {

        sendJson(
            response,
            400,
            {
                error:
                    "INVALID_JSON"
            }
        );

        return;

    }


    const expression =
        typeof payload.expression === "string"
            ? payload.expression.trim()
            : "";


    if (!expression) {

        sendJson(
            response,
            400,
            {
                error:
                    "MISSING_EXPRESSION"
            }
        );

        return;

    }


    try {

        const runtime =
            new WuwenRuntime(
                expression
            );


        const result =
            await runtime.run();


        sendJson(
            response,
            200,
            result.report
        );

    } catch (
        error
    ) {

        sendJson(
            response,
            500,
            {
                error:
                    "RUNTIME_ERROR",

                message:
                    error instanceof Error
                        ? error.message
                        : String(error)
            }
        );

    }

}


const server =
    http.createServer(
        async (
            request,
            response
        ) => {

            const method =
                request.method || "";

            const url =
                request.url || "";


            if (
                method === "OPTIONS"
            ) {

                response.writeHead(
                    204,
                    {
                        "Access-Control-Allow-Origin":
                            "*",

                        "Access-Control-Allow-Methods":
                            "GET, POST, OPTIONS",

                        "Access-Control-Allow-Headers":
                            "Content-Type"
                    }
                );

                response.end();

                return;

            }


            if (
                method === "POST" &&
                url === "/v1/responsibility/check"
            ) {

                await handleCheck(
                    request,
                    response
                );

                return;

            }


            if (
                method === "GET" &&
                url === "/health"
            ) {

                sendJson(
                    response,
                    200,
                    {
                        status:
                            "ok",

                        service:
                            "Wuwen-responsibility-runtime"
                    }
                );

                return;

            }


            sendJson(
                response,
                404,
                {
                    error:
                        "NOT_FOUND"
                }
            );

        }
    );


server.listen(
    PORT,
    HOST,
    () => {

        console.log(
            `Wuwen Responsibility API listening on http://${HOST}:${PORT}`
        );

        console.log(
            "POST /v1/responsibility/check"
        );

        console.log(
            "GET  /health"
        );

    }
);
