import { DocSocketClient } from "../clients/DocSocketClient";
import { AppStorage } from "./AppStorage";
import { ModalManager } from "./ModalManager";

export const appStorage = new AppStorage();
export const modalsManager = new ModalManager();
export let client: DocSocketClient|null = null;

export function setClient(newClient: DocSocketClient) {
    client = newClient;
}