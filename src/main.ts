import 'bulma/css/bulma.css';
import './style.css';
import { EditorView, basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { jsonLanguage } from '@codemirror/lang-json';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { Notification, NotificationType } from './utils/Notification';
import { ColyseusClient } from './clients/ColyseusClient';
import { appStorage, client, modalsManager, setClient } from './utils/instances';
import { SocketIOClient } from './clients/SocketIOClient';
import { WebSocketClient } from './clients/WebSocketClient';
import { TemplateMessage, TemplateMessageType } from './utils/TemplateMessage';
import { Project } from './app/Project';
import { createApp } from 'vue';
import Application from './app/Application.vue';
import ConnectionModal from './app/modals/ConnectionModal.vue';
import CreateProjectModal from './app/modals/CreateProjectModal.vue';
import EditMessageModal from './app/modals/EditMessageModal.vue';
import ExportModal from './app/modals/ExportModal.vue';
import MessageModal from './app/modals/MessageModal.vue';
import Menu from './app/menu/Menu.vue';

const state = EditorState.create({
    extensions: [
        basicSetup,
        jsonLanguage,
        oneDark,
        keymap.of([indentWithTab])
    ]
});
let contentEditor: EditorView|null = null;
export let editContentEditor: EditorView|null = null;

const app = createApp(Application);
app.component('Menu', Menu);
app.component('ConnectionModal', ConnectionModal);
app.component('CreateProjectModal', CreateProjectModal);
app.component('EditMessageModal', EditMessageModal);
app.component('ExportModal', ExportModal);
app.component('MessageModal', MessageModal);
app.mount('#app');

document.addEventListener('DOMContentLoaded', () => {
    handleEvents();    

    const messageEditorContent = document.getElementById('message-editor-content');
    if (messageEditorContent) {
        contentEditor = new EditorView({
            state,
            parent: messageEditorContent,
        });
    }

    recreateEditEditor("");
    
    appStorage.load();
});

export function recreateEditEditor(content?: string) {
    const editMessageEditorContent = document.getElementById('edit-message-editor-content');
    if (editMessageEditorContent) {
        editContentEditor = new EditorView({
            state: EditorState.create({
                doc: content ?? "",
                extensions: [
                    basicSetup,
                    jsonLanguage,
                    oneDark,
                    keymap.of([indentWithTab])
                ]
            }),
            parent: editMessageEditorContent
        });
    }
}

export function deleteChildrenOf(element: HTMLElement) {
    while (element.firstChild) {
        if (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
}

/**
 * Create events for app predefined elements
 */
function handleEvents() {
    // When the user add a new message
    const addMessage = document.getElementById('add-message');
    if (addMessage) {
        addMessage.addEventListener('submit', newMessage);
    }

    const loginForm = document.getElementById('login');
    if (loginForm) {
        loginForm.addEventListener('submit', connect);
    }

    const editForm = document.getElementById('edit-message-modal');
    if (editForm) {
        editForm.addEventListener('submit', editMessage);
    }

    const exportDocButton = document.getElementById('export');
    if (exportDocButton) {
        exportDocButton.addEventListener('click', (event: Event) => {
            event.preventDefault();

            let md = ``;
            const exportationElement = document.getElementById('export-code') as HTMLElement;
            if (exportationElement) {
                for (let i = 0; i < appStorage.messages.length; i++) {
                    const message: TemplateMessage = appStorage.messages[i];
                    if (message) {
                        md += message.toMarkdown();
                    }
                }

                exportationElement.innerHTML = md;
            }
        });
    }

    const exportCode = document.getElementById('export-code') as HTMLElement;
    const exportPre = document.getElementById('export-pre') as HTMLElement;
    if (exportPre && exportCode) {
        exportPre.addEventListener('click', (event: Event) => {
            event.preventDefault();

            navigator.clipboard.writeText(exportCode.innerText).then(() => {
                new Notification("The documentation has been copied", NotificationType.SUCCESS);
            }).catch(() => {
                new Notification("Impossible to copy inside the clipboard", NotificationType.SUCCESS);
            });
        });
    }

    const deleteButton = document.getElementById('reset') as HTMLElement;
    if (deleteButton) {
        deleteButton.addEventListener('click', (event: Event) => {
            event.preventDefault();

            if (confirm("Do you really want to reset the local storage")) {
                localStorage.clear();
                new Notification("Local storage has been cleared", NotificationType.SUCCESS);
            }
        });
    }

    const createProject = document.getElementById('create-project') as HTMLElement;
    if (createProject) {
        createProject.addEventListener('submit', (event: Event) => {
            event.preventDefault();

            const projectName = document.getElementById('project-name') as HTMLInputElement;
            if (projectName) {
                if (projectName.value.length > 0) {
                    const project = new Project(projectName.value);
                    appStorage.projects.push(project);
                    appStorage.currentProject = project;

                    // TODO: make the app accessible
                }
                
            }
        });
    }
}

/**
 * Create a new message and display a confirmation notification
 * @param event 
 */
function newMessage(event: Event) {
    event.preventDefault();

    const name = (document.getElementById('message-name') as HTMLInputElement).value;
    const args = contentEditor?.state.doc.toString() ?? "";
    const type = (document.getElementById('message-type') as HTMLSelectElement).value === 'request' ? TemplateMessageType.REQUEST : TemplateMessageType.RESPONSE;

    const templateMessage = new TemplateMessage(name, args, type);

    if (templateMessage && templateMessage.created) {
        appStorage.messages.push(templateMessage);
        appStorage.save();
        modalsManager.closeAllModals();
    }
    
    new Notification(`The message has been added.`, NotificationType.SUCCESS);
}

function editMessage(event: Event) {
    event.preventDefault();

    const name = (document.getElementById('edit-message-name') as HTMLInputElement).value;
    const args = editContentEditor?.state.doc.toString() ?? "";
    const type = (document.getElementById('edit-message-type') as HTMLSelectElement).value === 'request' ? TemplateMessageType.REQUEST : TemplateMessageType.RESPONSE;
    const strId = (document.getElementById("edit-message-modal") as HTMLElement).getAttribute("data-message");
    if (strId) {
        const id = parseInt(strId);
        const message = appStorage.messages[id];
        if (message) {
            message.edit(name, args, type);
        }
    }
}

/**
 * Connect the websocket server using the right client
 * @param event 
 * @returns 
 */
function connect(event: Event) {
    event.preventDefault();

    const roomName = (document.getElementById('room-name') as HTMLInputElement).value;
    const address = (document.getElementById('address') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const clientName = (document.getElementById('client') as HTMLSelectElement).value;

    if (!roomName || !address || !username || !clientName) {
        new Notification(`Please fill completely the connect form!`, NotificationType.ERROR);
        return;
    }

    switch (clientName) {
        case 'colyseus':
            setClient(new ColyseusClient(address, roomName, username));
            break;
        case 'socketio':
            setClient(new SocketIOClient(address, username));
            break;
        case 'websocket':
            setClient(new WebSocketClient(address, username));
            break;
    }
    
    if (client && client.connected) {
        const templateMessages = document.getElementById('template-messages') as HTMLElement;
        if (templateMessages) {
            templateMessages.classList.remove('disconnected');
        }

        appStorage.save();
    }
}