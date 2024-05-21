import { deleteChildrenOf, recreateEditEditor } from "../main";
import { Notification, NotificationType } from "./Notification";
import { appStorage, client, modalsManager } from "./instances";

export enum TemplateMessageType {
    REQUEST,
    RESPONSE
}

export class TemplateMessage {
    id: number;
    name: string;
    args: string;
    type: TemplateMessageType;
    created: boolean = false;
    mounted: boolean = false;

    constructor(name: string, args: string, type: TemplateMessageType) {
        this.id = appStorage.messages.length;
        this.name = name;
        this.args = args;
        this.type = type;

        this.create();
    }

    public create() {
        const parent = document.getElementById('template-messages') as HTMLElement;
        if (!parent) {
            return;
        }

        // Elements creation
        const templateMessage = document.createElement('div');
        const templateMessageInfos = document.createElement('div');
        const templateMessageName = document.createElement('div');
        const templateMessageActions = document.createElement('div');
        const templateMessageTestButton = document.createElement('button');
        const templateMessageTestButtonIcon = document.createElement('i');
        const templateMessageEditButton = document.createElement('button');
        const templateMessageEditButtonIcon = document.createElement('i');
        const templateMessageDeleteButton = document.createElement('button');
        const templateMessageDeleteButtonIcon = document.createElement('i');

        // ID
        templateMessage.id = `template-message-${this.id}`;

        // Classes
        templateMessage.classList.add('message-template');
        templateMessageInfos.classList.add('message-template-infos');
        templateMessageName.classList.add('message-template-name', 'tag', 'is-medium', 'is-link');
        templateMessageActions.classList.add('buttons', 'has-addons');
        templateMessageTestButton.classList.add('button', 'is-dark');
        templateMessageTestButtonIcon.classList.add('fas', 'fa-play')
        templateMessageEditButton.classList.add('button', 'is-dark', 'modal-opening-button');
        templateMessageEditButton.setAttribute('data-target', 'edit-message-modal');
        templateMessageEditButtonIcon.classList.add('fas', 'fa-pen-to-square')
        templateMessageDeleteButton.classList.add('button', 'is-danger', 'is-dark');
        templateMessageDeleteButtonIcon.classList.add('fas', 'fa-trash')

        // Events
        if (this.type === TemplateMessageType.REQUEST) {
            this.mounted = true;
            templateMessageTestButton.addEventListener('click', (event: Event) => {
                event.preventDefault();
                client?.request(this.name, this.args);
            });
        }
        else {
            if (client) {
                client.message(this.name);
                this.mounted = true;
            }
        }

        templateMessageEditButton.addEventListener('click', (event: Event) => {
            event.preventDefault();

            const modal = document.getElementById('edit-message-modal') as HTMLElement;
            if (modal) {
                modal.setAttribute('data-message', this.id.toString());
                (document.getElementById('edit-message-name') as HTMLInputElement).value = this.name;
                (document.getElementById('edit-message-type') as HTMLInputElement).value = this.type == TemplateMessageType.REQUEST ? "request" : "response";
                deleteChildrenOf((document.getElementById('edit-message-editor-content') as HTMLElement));
                recreateEditEditor(this.args);
                
                modalsManager.openModal(modal);
            }
        });

        templateMessageDeleteButton.addEventListener('click', (event: Event) => {
            event.preventDefault();

            if (confirm("Do you really want to delete this message?")) {
                if (appStorage.tryDelete(this.name)) {
                    templateMessage.remove();
                    appStorage.save();
                    new Notification("The message has been deleted.", NotificationType.SUCCESS);
                }
            }
        });

        // Children
        templateMessageName.appendChild(document.createTextNode(this.name));
        
        templateMessageTestButton.appendChild(templateMessageTestButtonIcon);
        templateMessageEditButton.appendChild(templateMessageEditButtonIcon);
        templateMessageDeleteButton.appendChild(templateMessageDeleteButtonIcon);

        templateMessageInfos.appendChild(templateMessageName);

        if (this.type === TemplateMessageType.REQUEST) {
            templateMessageActions.appendChild(templateMessageTestButton);
        }
        
        templateMessageActions.appendChild(templateMessageEditButton);
        templateMessageActions.appendChild(templateMessageDeleteButton);

        templateMessage.appendChild(templateMessageInfos);
        templateMessage.appendChild(templateMessageActions);

        parent.appendChild(templateMessage);
        this.created = true;
    }

    public edit(name: string, args: string, type: TemplateMessageType) {
        this.name = name;
        this.args = args;
        this.type = type;

        const element = document.getElementById(`template-message-${this.id}`) as HTMLElement;
        if (element) {
            (element.querySelector('.message-template-name') as HTMLElement).innerText = `${this.name}`;

            // TODO: if the type changed, add/remove the test button if needed
        }

        appStorage.save();
        modalsManager.closeAllModals();
    }

    public update(id: number) {
        const element = document.getElementById(`template-message-${this.id}`) as HTMLElement;
        if (element) {
            this.id = id;
            element.id = `template-message-${id}`;
        }
    }

    public mount() {
        if (this.mounted) {
            return;
        }

        if (client) {
            client.message(this.name);
            this.mounted = true;
        }
    }

    public toMarkdown() {
        const json = JSON.parse(this.args);
        let str = `\r### ${this.name}\nType: \`${TemplateMessageType[this.type]}\`\n\`\`\`json\n{\n`;
        
        const keys = Object.keys(json);
        const values = Object.values(json);
        for (let i = 0; i < keys.length; i++) {
            str += `\t"${keys[i]}": ${typeof(values[i])}`;
            if (i < keys.length - 1) {
                str += `\n`;
            }
        }

        str += `\n}\n\`\`\`\n`;

        return str;
    }
}