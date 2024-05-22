import { TemplateMessage } from "../utils/TemplateMessage";

export class Project {
    name: string;
    messages: TemplateMessage[];

    constructor(name: string) {
        this.name = name;
        this.messages = [];
    }

    save() {
        
    }
}