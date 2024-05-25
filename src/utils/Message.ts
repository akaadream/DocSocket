export enum MessageType {
    REQUEST,
    RESPONSE,
    ERROR
}

export interface Message {
    name: string;
    content: string;
    type: MessageType;
}