import { Client, Room } from "colyseus.js";
import { Notification, NotificationType } from "../utils/Notification";
import { appStorage, modalsManager } from "../utils/instances";
import { DocSocketClient } from "./DocSocketClient";
import { TemplateMessage } from "../utils/TemplateMessage";

export class ColyseusClient extends DocSocketClient {
    readonly client: Client;
    readonly username: string;
    currentRoom!: Room;

    constructor(address: string, roomName: string, username: string) {
        super();

        this.client = new Client(address);
        this.username = username;
        this.client.create(roomName, {
            username: username
        }).then((room: Room) => {
            this.currentRoom = room;

            for (let i = appStorage.messages.length - 1; i >= 0; i--) {
                const message: TemplateMessage = appStorage.messages[i];
                if (message && !message.mounted) {
                    message.mount();
                }
            }

            (document.getElementById('connection') as HTMLElement).classList.add('connected');
            (document.getElementById('connection-text') as HTMLElement).innerText = `Connected`;
            new Notification(`You've successfully been connected to the ${roomName} room.`, NotificationType.SUCCESS);
            (document.getElementById('connection-modal') as HTMLElement).style.display = "none";
            (document.getElementById('open-connection-modal') as HTMLElement).style.display = "none";

            modalsManager.closeAllModals();
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
}