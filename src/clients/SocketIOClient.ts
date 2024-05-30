import { DocSocketClient } from "./DocSocketClient";

export class SocketIOClient extends DocSocketClient {
    readonly username: string;

    constructor(_address: string, username: string) {
        super(_address);

        this.username = username;
    }

    public connect() {
        super.connect();
    }

    public disconnect() {
        super.disconnect();
    }

    public request(name: string, args: string) {
        super.request(name, args);
    }

    public message(_name: string) {
        super.message(_name);
    }

    public service(): string {
        return "socketio";
    }
}