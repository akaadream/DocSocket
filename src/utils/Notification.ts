export enum NotificationType {
    SUCCESS,
    ERROR,
    DEFAULT,
}

export class Notification {
    content: string;
    type: NotificationType;

    constructor(content: string, type: NotificationType) {
        this.content = content;
        this.type = type;
    }
}