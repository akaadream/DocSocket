export enum TemplateMessageType {
    REQUEST,
    RESPONSE
}

export interface TemplateMessage {
    id: number;
    name: string;
    args: string;
    type: TemplateMessageType;
}