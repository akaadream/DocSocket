import { DocSocketClient } from "./DocSocketClient";

export class SocketIOClient extends DocSocketClient {
    readonly username: string;

    constructor(_address: string, username: string) {
        super(_address);

        this.username = username;
    }

    public service(): string {
        return "socketio";
    }
}