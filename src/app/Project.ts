import { TemplateMessage } from "../utils/TemplateMessage";
import {slugify} from "../utils/Slugify.ts";

export class Project {
    name: string;
    slug: string;
    messages: TemplateMessage[];

    constructor(name: string, messages?: TemplateMessage[]) {
        this.name = name;
        this.slug = slugify(name);
        this.messages = [];

        if (messages && Array.isArray(messages)) {
            messages.forEach((element) => {
                if (element.name && element.args && element.type) {
                    this.messages.push(new TemplateMessage(element.name, element.args, element.type));
                }
            });
        }
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