import {TemplateMessage, TemplateMessageType} from "./TemplateMessage.ts";

export function toMarkdown(message: TemplateMessage) {
    const json = JSON.parse(message.args);
    let str = `\r### ${message.name}\nType: \`${TemplateMessageType[message.type]}\`\n\`\`\`json\n{\n`;

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