const ws = new require('ws');
const http = require("http");
const wss = new ws.Server({noServer: true});

const clients = new Set();

http.createServer((request, response) => {
    wss.handleUpgrade(request, request.socket, Buffer.alloc(0), onSocketConnect);
});

function onSocketConnect(ws) {
    clients.add(ws);

    ws.on('message', function(message) {
        message = message.slice(0, 50);

        for (let client of clients) {
            client.send(message);
        }
    });

    ws.on('close', function() {
        clients.delete(ws);
    });
}