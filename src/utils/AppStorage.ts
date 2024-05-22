import { Project } from "../app/Project";
import { Notification, NotificationType } from "./Notification";
import { TemplateMessage } from "./TemplateMessage";

// Projects key
const PROJECTS_KEY = "projects";

// Server login form keys
const ADDRESS_KEY = "address";
const ROOM_KEY = "room";
const USERNAME_KEY = "username";

export class AppStorage {
    projects: Project[];
    currentProject: Project|null;
    messages: TemplateMessage[];

    constructor() {
        this.messages = [];
        this.projects = [];
        this.currentProject = null;
    }

    /**
     * Load the app data from the local storage
     */
    load() {
        const data = localStorage.getItem(PROJECTS_KEY);
        if (data) {
            const json = JSON.parse(data);
            if (json && Array.isArray(json)) {
                json.forEach((element) => {
                    if (element.name && element.messages) {
                        this.projects.push(new Project(element.name, element.messages))
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

        const output = JSON.stringify(this.projects);
        if (output) {
            localStorage.setItem(PROJECTS_KEY, output);
        }

        new Notification(`The application's data has been saved`, NotificationType.SUCCESS);
    }
}