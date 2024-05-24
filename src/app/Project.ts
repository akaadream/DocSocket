import {TemplateMessage, TemplateMessageType} from "../utils/TemplateMessage";
import {slugify} from "../utils/Slugify.ts";
import {DocSocketClient} from "../clients/DocSocketClient.ts";

export class Project {
    name: string;
    slug: string;
    messages: TemplateMessage[];
    client: DocSocketClient|null;

    constructor(name: string, messages?: TemplateMessage[]) {
        this.name = name;
        this.slug = slugify(name);
        this.messages = [];
        this.client = null;

        if (messages && Array.isArray(messages)) {
            let i = 0;
            messages.forEach((element) => {
                if (element.name &&
                    element.args &&
                    element.type !== undefined) {
                    const message = new TemplateMessage(i, element.name, element.args, element.type);
                    if (message) {
                        this.messages.push(message);
                        i++;
                    }
                }
            });
        }

        addEventListener('client:room_joined', () => {
            this.listen();
        });
    }

    /**
     * Listen the responses
     */
    listen() {
        for (const message of this.messages) {
            if (message.type === TemplateMessageType.RESPONSE) {
                this.client?.message(message.name);
            }
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

    setClient(client: DocSocketClient|null) {
        if (client) {
            this.client = client;
        }
    }

    remap() {
        for (let i = 0; i < this.messages.length; i++) {
            const message: TemplateMessage = this.messages[i];
            if (message) {
                message.id = i;
            }
        }
    }

    toJson() {
        return {
            'name': this.name,
            'slug': this.slug,
            'messages': this.messages,
            'client': this.client?.toJson()
        };
    }
}