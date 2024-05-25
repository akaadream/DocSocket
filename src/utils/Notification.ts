export enum NotificationType {
    SUCCESS,
    ERROR,
    DEFAULT,
}

export interface Notification {
    content: string;
    type: NotificationType;
}