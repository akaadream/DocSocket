import { Message, MessageType } from "../utils/Message";

export class DocSocketClient {
    readonly messages: Message[];
    connected: boolean;
    address: string;
    
    constructor(address: string) {
        this.messages = [];
        this.connected = false;

        this.address = address;
    }

    public connect() {

    }

    public disconnect() {

    }

    public request(name: string, args: string): void {
        this.messages.push(new Message(name, args, MessageType.REQUEST));
    }

    protected reponse(name: string, obj: object): void {
        this.messages.push(new Message(name, JSON.stringify(obj, null, 2), MessageType.RESPONSE));
    }

    public message(_name: string): void {

    }

    public service(): string {
        return "client";
    }

    public toJson() {
        return {
            'address': this.address,
            'service': this.service()
        }
    }
}