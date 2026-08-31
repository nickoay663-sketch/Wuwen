import http from "node:http";


const server =
    http.createServer(
        (
            request,
            response
        ) => {

            response.writeHead(
                200,
                {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                }
            );

            response.end(
                "ok"
            );

        }
    );


server.on(
    "error",
    error => {

        console.error(
            "TEST_FILE_SERVER_ERROR"
        );

        console.error(
            error
        );

        process.exitCode =
            1;

    }
);


server.listen(
    0,
    "127.0.0.1",
    () => {

        const address =
            server.address();

        console.log(
            "TEST_FILE_SERVER_LISTENING"
        );

        console.log(
            "address=",
            address
        );

        server.close(
            error => {

                if (error) {

                    console.error(
                        "TEST_FILE_SERVER_CLOSE_ERROR"
                    );

                    console.error(
                        error
                    );

                    process.exitCode =
                        1;

                    return;

                }

                console.log(
                    "TEST_FILE_SERVER_CLOSED"
                );

            }
        );

    }
);
