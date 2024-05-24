import { Client, Room } from "colyseus.js";
import { Notification, NotificationType } from "../utils/Notification";
import { DocSocketClient } from "./DocSocketClient";

export class ColyseusClient extends DocSocketClient {
    readonly client: Client;
    readonly username: string;
    readonly roomName: string;
    currentRoom!: Room;

    constructor(address: string, roomName: string, username: string) {
        super(address);

        this.client = new Client(address);
        this.username = username;
        this.roomName = roomName;
        this.client.create(roomName, {
            username: username
        }).then((room: Room) => {
            this.currentRoom = room;
            this.connected = true;

            new Notification(`You've successfully been connected to the ${roomName} room.`, NotificationType.SUCCESS);
        }).catch(() => {
            new Notification(`Impossible to create or join a ${roomName} room.`, NotificationType.ERROR);
        });
    }

    public request(name: string, args: string): void {
        this.currentRoom.send(name, args);
        super.request(name, args);
    }

    public message(name: string) {
        if (!name) {
            return;
        }

        if (!this.currentRoom) {
            return;
        }

        this.currentRoom.onMessage(name, (response: any) => {
            if (response instanceof Object && response.message) {
                this.reponse(name, JSON.parse(response.message));
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