import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import {Notification, NotificationType} from "../../utils/Notification.ts";
import {useProjectStore} from "./project.ts";
import {Project} from "../../utils/Project.ts";
import {slugify} from "../../utils/Slugify.ts";
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
    const notifications: Ref<Notification[]> = ref([]);


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
        notifications.value.push({
            content: content,
            type: type
        });
    }

    /**
     * Load the app data from the local storage
     */
    function load() {
        // Load projects
        const data = localStorage.getItem(PROJECTS_KEY);
        if (data) {
            projects.value = JSON.parse(data) as Project[];
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

        const projectStore = useProjectStore();
        const currentlySelected = localStorage.getItem(LAST_SELECTED_PROJECT_KEY);
        if (currentlySelected) {
            const project = projects.value.find((project: Project) => project.name ? project.name === currentlySelected : false);
            if (project) {
                projectStore.hydrate(project.name, slugify(project.name), project.templates);
            }
        }

        projectStore.generateDocumentation();
    }

    /**
     * Load the app data into the local storage
     */
    function save() {
        const projectStore = useProjectStore();

        localStorage.setItem(ADDRESS_KEY, defaultAddress.value);
        localStorage.setItem(ROOM_KEY, defaultRoom.value);
        localStorage.setItem(USERNAME_KEY, defaultUsername.value);
        localStorage.setItem(SERVICE_KEY, defaultService.value);
        localStorage.setItem(LAST_SELECTED_PROJECT_KEY, projectStore.name ?? "");

        const output = JSON.stringify(projects.value);
        if (output) {
            localStorage.setItem(PROJECTS_KEY, output);
        }
    }

    /**
     * Clear the local storage and all the current data
     */
    function clear() {
        const projectStore = useProjectStore();
        localStorage.clear();

        defaultAddress.value = "ws://localhost:2567";
        defaultService.value = "colyseus";
        defaultRoom.value = "";
        defaultUsername.value = "";

        projects.value = [];
        projectStore.disconnect();
        projectStore.slug = "";
        projectStore.name = "";
        projectStore.messages = [];
        projectStore.templates = [];
        projectStore.selectedMessage = undefined;
        projectStore.documentation = "";

        appendNotification("Local storage has been successfully deleted.", NotificationType.SUCCESS);
    }

    /**
     * Create a new project and automatically select it by default
     * @param projectName
     */
    function createProject(projectName: string) {
        const projectStore = useProjectStore();
        const project: Project = {
            name: projectName,
            templates: [],
        };
        projects.value.push(project);
        projectStore.hydrate(project.name, slugify(project.name), []);

        appendNotification("The project has been successfully created!", NotificationType.SUCCESS);

        save();
    }

    /**
     * Select another project
     * @param projectName
     */
    function selectProject(projectName: string) {
        const projectStore = useProjectStore();
        const nextProject = projects.value.find((project: Project) => project.name === projectName);
        if (nextProject) {
            projectStore.hydrate(nextProject.name, slugify(nextProject.name), nextProject.templates);
            save();
        }
    }

    /**
     * Return true if a project with the given name already exists
     * @param projectName
     */
    function alreadyExists(projectName: string): boolean {
        for (const project of projects.value) {
            if (project.name === projectName) {
                return true;
            }
        }

        return false;
    }

    /**
     * Add a message to a specific project data
     * (this function is called right after a message has been added to the currently opened project)
     * @param projectName
     * @param templateMessage
     */
    function addMessageTo(projectName: string, templateMessage: TemplateMessage) {
        for (const project of projects.value) {
            if (project.name === projectName) {
                project.templates.push(templateMessage);
            }
        }
    }

    /**
     * Delete a message from a specific project data
     * @param projectName
     * @param messageName
     */
    function deleteMessageFrom(projectName: string, messageName: string) {
        for (const project of projects.value) {
            if (project.name === projectName) {
                for (let i = project.templates.length - 1; i >= 0; i--) {
                    const message = project.templates[i];
                    if (message.name === messageName) {
                        project.templates.splice(i, 1);
                        save();
                    }
                }
            }
        }
    }

    /**
     * Update the project corresponding with the given name by replacing its template messages by the given messages array
     * @param projectName
     * @param messages
     */
    function updateProject(projectName: string, messages: TemplateMessage[]) {
        let updated: boolean = false;
        for (const project of projects.value) {
            if (project.name === projectName) {
                project.templates = messages;
                updated = true;
            }
        }

        if (updated) {
            save();
        }
    }

    /**
     * Delete an existing project
     * @param projectName
     */
    function deleteProject(projectName: string) {
        const projectStore = useProjectStore();
        const lengthBefore = projects.value.length;
        projects.value = projects.value.filter((project: Project) => project.name !== projectName);

        if (lengthBefore !== projects.value.length) {
            appendNotification("The project was successfully deleted.", NotificationType.SUCCESS);
        }
        else {
            appendNotification("Unexpected error. The project cannot be delete.", NotificationType.ERROR);
            return;
        }

        if (projectStore.name === projectName) {
            projectStore.$reset();
            if (projects.value.length > 0) {
                const project = projects.value[0];
                projectStore.hydrate(project.name, slugify(project.name), project.templates);
            }
        }

        save();
    }

    return {
        defaultAddress,
        defaultRoom,
        defaultService,
        defaultUsername,
        notifications,
        projects,

        addMessageTo,
        alreadyExists,
        appendNotification,
        clear,
        createProject,
        deleteMessageFrom,
        deleteProject,
        load,
        updateProject,
        save,
        selectProject,
    };
})