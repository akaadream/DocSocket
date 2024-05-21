import { DocSocketClient } from "./DocSocketClient";

export class SocketIOClient extends DocSocketClient {
    readonly username: string;

    constructor(address: string, username: string) {
        super();

        this.username = username;
    }
}