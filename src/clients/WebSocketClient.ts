import { DocSocketClient } from "./DocSocketClient";

export class WebSocketClient extends DocSocketClient {
    readonly username: string;
    socket: WebSocket|null;
    messages: string[];

    constructor(address: string, username: string) {
        super(address);

        this.messages = [];
        this.username = username;
        this.socket = null;
    }

    public listen() {
        if (!this.socket) {
            return;
        }

        this.socket.onmessage = (event) => {
            const name = event.data.name;
            const options = event.data.options;
            if (name && options) {
                if (this.messages.includes(name)) {
                    this.socket?.send(name);
                }
                // TODO: create the message
            }
        }
    }

    public connect() {
        this.socket = new WebSocket(this.address);
        this.socket.onopen = function (_event) {

        }

        this.socket.onclose = function (_event) {

        }
    }

    public disconnect() {
        this.socket?.close();
    }

    public request(name: string, args: string) {
        super.request(name, args);
    }

    public message(name: string) {
        super.message(name);
    }

    public service(): string {
        return "websocket";
    }
}