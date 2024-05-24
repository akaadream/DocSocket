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

    constructor(id: number, name: string, args: string, type: TemplateMessageType) {
        this.id = id;
        this.name = name;
        this.args = args;
        this.type = type;
    }

    public edit(name: string, args: string, type: TemplateMessageType) {
        this.name = name;
        this.args = args;
        this.type = type;
    }

    public toMarkdown() {
        const json = JSON.parse(this.args);
        let str = `\r### ${this.name}\nType: \`${TemplateMessageType[this.type]}\`\n\`\`\`json\n{\n`;
        
        const keys = Object.keys(json);
        const values = Object.values(json);
        for (let i = 0; i < keys.length; i++) {
            str += `\t"${keys[i]}": "${typeof(values[i])}"`;
            if (i < keys.length - 1) {
                str += `\n`;
            }
        }

        str += `\n}\n\`\`\`\n`;

        return str;
    }
}