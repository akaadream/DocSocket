import {defineStore} from "pinia";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import {DocSocketClient} from "../../clients/DocSocketClient.ts";
import {ref, Ref} from "vue";
import {TemplateMessage, TemplateMessageType} from "../../utils/TemplateMessage.ts";
import {Message, MessageType} from "../../utils/Message.ts";
import {ColyseusClient} from "../../clients/ColyseusClient.ts";
import {SocketIOClient} from "../../clients/SocketIOClient.ts";
import {WebSocketClient} from "../../clients/WebSocketClient.ts";
import {toMarkdown} from "../../utils/Export.ts";
import {useGlobalStore} from "./global.ts";
import {NotificationType} from "../../utils/Notification.ts";

hljs.registerLanguage('json', json);

export const COLYSEUS_NAME = "client";
export const SOCKET_IO_NAME = "socketio";
export const WEBSOCKET_NAME = "websocket";

/**
 * Define the project store
 * This store represent the current selected project
 */
export const useProjectStore = defineStore('project', () => {
    const name: Ref<string> = ref("");
    const slug: Ref<string> = ref("");
    const client: Ref<DocSocketClient|null> = ref(null);
    const templates: Ref<TemplateMessage[]> = ref([]);
    const messages: Ref<Message[]> = ref([]);
    const selectedMessage: Ref<TemplateMessage|undefined> = ref(undefined);
    const documentation: Ref<string> = ref("");

    /**
     * If a project can be considered as selected
     */
    function selected(): boolean {
        return name.value !== "" && slug.value !== "";
    }

    /**
     * Connect the user to the right service
     * @param service
     * @param address
     * @param roomName
     * @param username
     */
    function connect(service: string, address: string, roomName: string, username: string) {
        switch (service) {
            case COLYSEUS_NAME:
                client.value = new ColyseusClient(address, roomName, username);
                break;
            case SOCKET_IO_NAME:
                client.value = new SocketIOClient(address, username);
                break;
            case WEBSOCKET_NAME:
                client.value = new WebSocketClient(address, username);
                break;
        }
    }

    /**
     * Return true if the client is currently connected
     */
    function connected(): boolean {
        return client.value?.connected ?? false;
    }

    /**
     * Disconnect the user from the service
     */
    function disconnect() {
        client.value?.disconnect();
        client.value = null;
    }

    /**
     * Hydrate the project store with initial values
     * @param newName
     * @param newSlug
     * @param newTemplates
     */
    function hydrate(newName: string, newSlug: string, newTemplates: TemplateMessage[]) {
        name.value = newName;
        slug.value = newSlug;

        templates.value = [];
        if (newTemplates) {
            for (let i = 0; i < newTemplates.length; i++) {
                const message = newTemplates[i];
                templates.value.push({
                    id: message.id,
                    name: message.name,
                    args: message.args,
                    type: message.type
                });
            }
        }
    }

    /**
     * Listen messages
     */
    function listen() {
        for (const message of templates.value) {
            listenOne(message);
        }
    }

    /**
     * Listen one single message
     * @param message
     */
    function listenOne(message: TemplateMessage) {
        if (message.type === TemplateMessageType.RESPONSE) {
            client.value?.message(message.name);
        }
    }

    /**
     * Generate documentation
     */
    function generateDocumentation() {
        documentation.value = "";

        let md = ``;
        for (const message of templates.value) {
            md += toMarkdown(message);
        }

        documentation.value = md;
    }

    function getHighlighted(): string {
        return hljs.highlight(documentation.value, {
            language: 'json'
        }).value;
    }

    /**
     * Add a new template message inside the project
     * @param messageName
     * @param args
     * @param type
     */
    function addTemplate(messageName: string, args: string, type: TemplateMessageType) {
        const globalStore = useGlobalStore();
        const message: TemplateMessage = {
            id: templates.value.length,
                name: messageName,
                args: args,
                type: type
        };
        templates.value.push(message);
        globalStore.addMessageTo(name.value, message);

        if (type === TemplateMessageType.RESPONSE) {
            listenOne(message);
        }

        generateDocumentation();
        globalStore.save();

        return message;
    }

    /**
     * Edit an existing template
     * @param oldName
     * @param newName
     * @param args
     * @param type
     */
    function editTemplate(oldName: string, newName: string, args: string, type: TemplateMessageType) {
        const globalStore = useGlobalStore();
        for (const message of templates.value) {
            if (message.name === oldName) {
                message.name = newName;
                message.args = args;
                message.type = type;
                globalStore.appendNotification("The template message has been successfully edited!", NotificationType.SUCCESS);
            }
        }
        // Update data
        generateDocumentation();
        globalStore.updateProject(name.value, templates.value);
    }

    /**
     * Delete the template message corresponding to the given name and return true if it succeeds and false otherwise
     * @param name
     */
    function deleteTemplate(name: string): boolean {
        for (let i = templates.value.length - 1; i >= 0; i--) {
            const message = templates.value[i];
            if (message && message.name === name) {
                templates.value.splice(i, 1);
                generateDocumentation();
                return true;
            }
        }
        return false;
    }

    /**
     * Clear all the output messages
     */
    function clearMessages() {
        messages.value = [];
    }

    /**
     * Define a new client on the project
     * @param newClient
     */
    function setClient(newClient: DocSocketClient) {
        client.value = newClient;
    }

    /**
     * Add a new message inside the project
     * @param name
     * @param content
     * @param type
     */
    function addMessage(name: string, content: string, type: MessageType) {
        messages.value.push({
            name: name,
            content: content,
            type: type
        });
    }

    /**
     * Select a new message
     * @param name
     * @param type
     */
    function selectMessage(name: string, type: TemplateMessageType) {
        for (const message of templates.value) {
            if (message.name === name && message.type === type) {
                selectedMessage.value = message;
            }
        }
    }

    /**
     * Get the json representation of the project
     */
    function toJson() {
        return {
            'name': name,
            'slug': slug,
            'messages': templates.value,
            'client': client.value?.toJson()
        }
    }

    /**
     * Remap template messages ID (maybe not necessary since we use VueJS)
     */
    function remap() {
        for (let i = 0; i < templates.value.length; i++) {
            const message = templates.value[i];
            if (message) {
                message.id = i;
            }
        }
    }

    return {
        documentation,
        name,
        slug,
        client,
        messages,
        selectedMessage,
        templates,

        addMessage,
        addTemplate,
        clearMessages,
        connect,
        connected,
        deleteTemplate,
        disconnect,
        editTemplate,
        generateDocumentation,
        getHighlighted,
        hydrate,
        listen,
        listenOne,
        remap,
        selected,
        selectMessage,
        setClient,
        toJson,
    }
});