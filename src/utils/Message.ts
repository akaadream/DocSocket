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
    }
}