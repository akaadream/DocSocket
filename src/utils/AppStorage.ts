import { Notification, NotificationType } from "./Notification";
import { TemplateMessage } from "./TemplateMessage";

const MESSAGE_KEY = "messages";
const ADDRESS_KEY = "address";
const ROOM_KEY = "room";
const USERNAME_KEY = "username";

export class AppStorage {
    messages: TemplateMessage[];

    constructor() {
        this.messages = [];

        // TODO: load the last project and hydrate the app
    }

    /**
     * Load the app data from the local storage
     */
    load() {
        const data = localStorage.getItem(MESSAGE_KEY);
        if (data) {
            const json = JSON.parse(data);
            if (json && Array.isArray(json)) {
                json.forEach((element) => {
                    if (element.name && element.args) {
                        this.messages.push(new TemplateMessage(element.name, element.args, element.type));
                    }
                });
            }
        }

        (document.getElementById('address') as HTMLInputElement).value = localStorage.getItem(ADDRESS_KEY) ?? "";
        (document.getElementById('room-name') as HTMLInputElement).value = localStorage.getItem(ROOM_KEY) ?? "";
        (document.getElementById('username') as HTMLInputElement).value = localStorage.getItem(USERNAME_KEY) ?? "";

        new Notification(`The application's data has been loaded`, NotificationType.SUCCESS);
    }

    /**
     * Save the app data inside the local storage
     */
    save() {
        const address = (document.getElementById('address') as HTMLInputElement).value;
        const roomName = (document.getElementById('room-name') as HTMLInputElement).value;
        const username = (document.getElementById('username') as HTMLInputElement).value;

        localStorage.setItem(ADDRESS_KEY, address);
        localStorage.setItem(ROOM_KEY, roomName);
        localStorage.setItem(USERNAME_KEY, username);

        const output = JSON.stringify(this.messages);
        if (output) {
            localStorage.setItem(MESSAGE_KEY, output);
        }

        new Notification(`The application's data has been saved`, NotificationType.SUCCESS);
    }

    /**
     * Try to delete the message with the name corresponding to the given one
     * @param name 
     * @returns true if the element has been removed, else false
     */
    tryDelete(name: string) {
        for (let i = this.messages.length - 1; i >= 0; i--) {
            const message: TemplateMessage = this.messages[i];
            if (message && message.name === name) {
                this.messages.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    remap() {
        for (let i = 0; i < this.messages.length; i++) {
            const message: TemplateMessage = this.messages[i];
            if (message) {
                message.update(i);
            }
        }
    }
}