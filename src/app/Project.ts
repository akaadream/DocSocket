import { TemplateMessage } from "../utils/TemplateMessage";

export class Project {
    name: string;
    messages: TemplateMessage[];

    constructor(name: string, messages?: TemplateMessage[]) {
        this.name = name;
        this.messages = [];

        if (messages && Array.isArray(messages)) {
            messages.forEach((element) => {
                if (element.name && element.args && element.type) {
                    this.messages.push(new TemplateMessage(element.name, element.args, element.type));
                }
            });
        }

        this.create();
    }

    create() {
        const parent = document.getElementById('nav') as HTMLElement;
        if (!parent) {
            return;
        }

        const menuElement = document.createElement('a');
        menuElement.classList.add('nav-link');

        const menuIcon = document.createElement('i');
        menuIcon.classList.add('fas', 'fa-folder');

        menuElement.appendChild(menuIcon);
        menuElement.appendChild(document.createTextNode(`${this.name}`));

        parent.appendChild(menuElement);
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