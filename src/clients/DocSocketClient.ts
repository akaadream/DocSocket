import {MessageType} from "../utils/Message";
import {useProjectStore} from "../app/storages/project.ts";

export class DocSocketClient {
    connected: boolean;
    address: string;
    
    constructor(address: string) {
        this.connected = false;

        this.address = address;
    }

    public connect() {

    }

    public disconnect() {

    }

    public request(name: string, args: string): void {
        const projectStore = useProjectStore();
        projectStore.addMessage(name, args, MessageType.REQUEST);
    }

    protected response(name: string, obj: object): void {
        const projectStore = useProjectStore();
        projectStore.addMessage(name, JSON.stringify(obj, null, 2), MessageType.RESPONSE);
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