import { Client, Room } from "colyseus.js";
import { NotificationType } from "../utils/Notification";
import { DocSocketClient } from "./DocSocketClient";
import {useGlobalStore} from "../app/storages/global.ts";

export class ColyseusClient extends DocSocketClient {
    readonly username: string;
    readonly roomName: string;
    client: Client|null;
    currentRoom: Room|null;

    constructor(address: string, roomName: string, username: string) {
        super(address);

        this.client = null;
        this.currentRoom = null;
        this.username = username;
        this.roomName = roomName;

        this.connect();
    }

    public connect() {
        const store = useGlobalStore();

        this.client = new Client(this.address);
        this.client?.create(this.roomName, {
            username: this.username
        }).then((room: Room) => {
            console.log("");
            this.currentRoom = room;
            this.connected = true;

            store.appendNotification(`You've successfully been connected to the ${this.roomName} room.`, NotificationType.SUCCESS);
            dispatchEvent(new Event('client:room_joined'));
        }).catch(() => {
            store.appendNotification(`Impossible to create or join a ${this.roomName} room.`, NotificationType.ERROR);
        });
    }

    public disconnect() {
        if (!this.client || !this.currentRoom) {
            return;
        }

        const store = useGlobalStore();
        this.currentRoom?.leave(true);
        this.currentRoom = null;
        this.client = null;
        store.appendNotification(`You've successfully been disconnected.`, NotificationType.SUCCESS);
    }

    public request(name: string, args: string): void {
        this.currentRoom?.send(name, args);
        super.request(name, args);
    }

    public message(name: string) {
        if (!name) {
            console.warn("no name");
            return;
        }

        if (!this.currentRoom) {
            console.warn("no current room");
            return;
        }

        console.log(`message ${name} listened`);
        this.currentRoom.onMessage(name, (response: any) => {
            if (response instanceof Object && response.message) {
                this.response(name, JSON.parse(response.message));
            }
        });
    }

    public service(): string {
        return "colyseus";
    }

    public toJson() {
        return {
            'address': this.address,
            'service': this.service(),
            'roomName': this.roomName,
            'username': this.username
        }
    }
}