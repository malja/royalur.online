import WebSocket from "ws";
import queryString from "query-string";

function websocket(express_server) {
    const websocket_server = new WebSocket.Server({
        // Nebude se používat dodatečný HTTP server, protože jako takový slouží Express
        noServer: true,
        path: "/ws"
    });

    // Přechod klasického HTTP na WebSocket
    express_server.on("upgrade", (request, socket, head) => {
        websocket_server.handleUpgrade(request, socket, head, (ws) => {
            websocket_server.emit("connection", ws, request);
        });
    });

    // Ošetření příchozí komunikace
    websocket_server.on("connection", (connection, request) => {
       const [_, params] = request?.url?.split("?");
       const connection_params = queryString.parse(params);

       // TODO: Ošetřit existenci hráče

        // Příchozí zpráva od hráče
        websocket_server.on("message", (message) => {
            JSON.parse(message).then((data) => {
                connection.send(JSON.stringify({
                    text: "hallo!"
                }));

                console.log(data);
            }).catch((error) => {
                console.log(error);
            });
        });
    });

    return websocket_server;
}