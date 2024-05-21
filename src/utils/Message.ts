import hljs from "highlight.js/lib/core";
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('json', json);

export enum MessageType {
    REQUEST,
    RESPONSE,
    ERROR
}

export class Message {
    name: string;
    content: string;
    type: MessageType;

    constructor(name: string, content: string, type: MessageType) {
        this.name = name;
        this.content = content;
        this.type = type;

        this.create();
    }

    create() {
        const parent = document.getElementById('messages') as HTMLElement;
        if (!parent) {
            return;
        }

        // Elements
        const messageElement = document.createElement('div');
        const messageHeader = document.createElement('div');
        const messageName = document.createElement('div');
        const messageType = document.createElement('div');
        const messageDropdown = document.createElement('div');
        const messageDropdownIcon = document.createElement('i');
        const messageContent = document.createElement('div');
        const messagePre = document.createElement('pre');
        const messageCode = document.createElement('code');

        // Classes
        messageElement.classList.add('message');
        messageHeader.classList.add('message-header');
        messageName.classList.add('message-name', 'tag', 'is-medium');
        messageType.classList.add('message-type');
        messageDropdown.classList.add('message-dropdown');
        messageDropdownIcon.classList.add('fa-solid', 'fa-caret-down');
        messageContent.classList.add('message-content');
        messageCode.classList.add('language-json');

        switch (this.type) {
            case MessageType.RESPONSE:
                messageName.classList.add('is-success');
                break;
            case MessageType.REQUEST:
                messageName.classList.add('is-warning');
                break;
            case MessageType.ERROR:
                messageName.classList.add('is-danger');
                break;
        }

        messageElement.addEventListener('click', this.toggleMessage);

        // Text nodes
        messageName.appendChild(document.createTextNode(this.name));
        messageType.appendChild(document.createTextNode(`[${MessageType[this.type]}] MESSAGE`));

        const highlighted = hljs.highlight(this.content, {
            language: 'json'
        });
        messageCode.innerHTML = highlighted.value;
        messagePre.appendChild(messageCode);
        messageContent.appendChild(messagePre);

        messageDropdown.appendChild(messageDropdownIcon);

        // Childs
        messageHeader.appendChild(messageName);
        messageHeader.appendChild(messageType);
        messageHeader.appendChild(messageDropdown);
        messageElement.appendChild(messageHeader);
        messageElement.appendChild(messageContent);

        parent.appendChild(messageElement);
    }

    toggleMessage(event: Event) {
        event.preventDefault();

        const element = event.target;
        if (element instanceof HTMLElement) {
            (element as HTMLElement).parentElement?.classList.toggle('opened');
        }
    }
}