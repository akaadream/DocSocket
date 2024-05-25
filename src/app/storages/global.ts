import {defineStore, Store} from "pinia";
import {Ref, ref} from "vue";
import {Project} from "../Project.ts";
import {Notification, NotificationType} from "../../utils/Notification.ts";
import {Message} from "../../utils/Message.ts";
import {DocSocketClient} from "../../clients/DocSocketClient.ts";
import {ColyseusClient} from "../../clients/ColyseusClient.ts";
import {SocketIOClient} from "../../clients/SocketIOClient.ts";
import {WebSocketClient} from "../../clients/WebSocketClient.ts";
import {TemplateMessage} from "../../utils/TemplateMessage.ts";

// Projects key
const PROJECTS_KEY = "projects";

// Server login form keys
const ADDRESS_KEY = "address";
const ROOM_KEY = "room";
const USERNAME_KEY = "username";
const SERVICE_KEY = "service";
const LAST_SELECTED_PROJECT_KEY = "current";

export const useGlobalStore = defineStore('global', () => {
    const projects: Ref<Project[]> = ref([]);
    const currentProject: Ref<Project|null> = ref(null);
    const notifications: Ref<Notification[]> = ref([]);

    const storeProjects: Ref<Store[]> = ref([]);

    const defaultAddress = ref("ws://localhost:2567");
    const defaultRoom = ref("");
    const defaultService = ref("colyseus");
    const defaultUsername = ref("");

    /**
     * Add a new notification
     * @param content
     * @param type
     */
    function appendNotification(content: string, type: NotificationType) {
        notifications.value.push(new Notification(content, type));
    }

    /**
     * Load the app data from the local storage
     */
    function load() {
        // Load projects
        const data = localStorage.getItem(PROJECTS_KEY);
        if (data) {
            const json = JSON.parse(data);
            if (json && Array.isArray(json)) {
                json.forEach((element) => {
                    console.log("element", element);
                    if (element.name &&
                        element.slug &&
                        element.messages) {

                        const project = new Project(element.name, element.messages);
                        projects.value.push(project);

                        if (element.client) {
                            let client: DocSocketClient|null = null;

                            switch (element.client.service) {
                                case 'colyseus':
                                    client = new ColyseusClient(element.client.address, element.client.roomName, element.client.username);
                                    break;
                                case 'socketio':
                                    client = new SocketIOClient(element.client.address, element.client.username);
                                    break;
                                case 'websocket':
                                    client = new WebSocketClient(element.client.address, element.client.username);
                                    break;
                            }

                            if (client) {
                                project.setClient(client);
                            }
                        }
                    }
                });
            }
        }

        // Load connection information
        const address = localStorage.getItem(ADDRESS_KEY);
        if (address) {
            defaultAddress.value = address;
        }
        const room = localStorage.getItem(ROOM_KEY);
        if (room) {
            defaultRoom.value = room;
        }
        const service = localStorage.getItem(SERVICE_KEY);
        if (service) {
            defaultService.value = service;
        }
        const username = localStorage.getItem(USERNAME_KEY);
        if (username) {
            defaultUsername.value = username;
        }

        const currentlySelected = localStorage.getItem(LAST_SELECTED_PROJECT_KEY);
        if (currentlySelected) {
            const project = projects.value.find((project: Project) => project.name === currentlySelected);
            if (project) {
                currentProject.value = project;
            }
        }
    }

    /**
     * Load the app data into the local storage
     */
    function save() {
        localStorage.setItem(ADDRESS_KEY, defaultAddress.value);
        localStorage.setItem(ROOM_KEY, defaultRoom.value);
        localStorage.setItem(USERNAME_KEY, defaultUsername.value);
        localStorage.setItem(SERVICE_KEY, defaultService.value);
        localStorage.setItem(LAST_SELECTED_PROJECT_KEY, currentProject.value?.name ?? "");

        const convertedProjects: Object[] = [];
        for (const project of projects.value) {
            convertedProjects.push(project.toJson());
        }
        const output = JSON.stringify(convertedProjects);
        if (output) {
            localStorage.setItem(PROJECTS_KEY, output);
        }
    }

    /**
     * Create a new project and automatically select it by default
     * @param projectName
     */
    function createProject(projectName: string) {
        const project = new Project(projectName);
        projects.value.push(project);
        currentProject.value = project;

        appendNotification("The project has been successfully created!", NotificationType.SUCCESS);

        save();
    }

    /**
     * Select another project
     * @param projectName
     */
    function selectProject(projectName: string) {
        const nextProject = projects.value.find((project: Project) => project.name === projectName);
        if (nextProject) {
            currentProject.value = nextProject;
        }
    }

    /**
     * Delete an existing project
     * @param projectName
     */
    function deleteProject(projectName: string) {
        const lengthBefore = projects.value.length;
        projects.value = projects.value.filter((project: Project) => project.name !== projectName);

        if (lengthBefore !== projects.value.length) {
            appendNotification("The project was successfully deleted.", NotificationType.SUCCESS);
        }
        else {
            appendNotification("Unexpected error. The project cannot be delete.", NotificationType.ERROR);
            return;
        }

        if (currentProject.value && currentProject.value?.name === projectName) {
            currentProject.value = null;
            if (projects.value.length > 0) {
                currentProject.value = projects.value[0];
            }
        }

        save();
    }

    /**
     * Return true if the client is connected
     */
    function clientConnected(): boolean {
        return currentProject.value?.client?.connected ?? false;
    }

    /**
     * Disconnect the user from the service
     */
    function disconnectFromClient() {
        currentProject.value?.client?.disconnect();
    }

    /**
     * Get an array containing all the output messages of the app
     */
    function getMessages(): Message[] {
        return currentProject.value?.client?.messages ?? [];
    }

    /**
     * Get the documentation we want to export as a string
     */
    function getExport(): string {
        if (!currentProject.value) {
            return '';
        }

        let exportCode = ``;
        for (let i = 0; i < currentProject.value?.messages.length; i++) {
            const message: TemplateMessage = currentProject.value?.messages[i];
            if (message) {
                exportCode += message.toMarkdown();
            }
        }

        return exportCode;
    }

    return {
        currentProject,
        defaultAddress,
        defaultRoom,
        defaultService,
        defaultUsername,
        notifications,
        projects,
        storeProjects,

        appendNotification,
        clientConnected,
        createProject,
        deleteProject,
        disconnectFromClient,
        getExport,
        getMessages,
        load,
        save,
        selectProject,
    };
})