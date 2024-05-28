<script setup lang="ts">
import Modal from "./Modal.vue";
import {useGlobalStore} from "../storages/global.ts";
import {ColyseusClient} from "../../clients/ColyseusClient.ts";
import {WebSocketClient} from "../../clients/WebSocketClient.ts";
import {SocketIOClient} from "../../clients/SocketIOClient.ts";
import {NotificationType} from "../../utils/Notification.ts";
import {DocSocketClient} from "../../clients/DocSocketClient.ts";
import {useModalsStore} from "../storages/modals.ts";
import {useProjectStore} from "../storages/project.ts";

const globalStore = useGlobalStore();
const projectStore = useProjectStore();
const modalsStore = useModalsStore();

/**
 * Connect the user on the server using the right service
 */
function connect() {
    if (!globalStore.defaultRoom || !globalStore.defaultService || !globalStore.defaultAddress || !globalStore.defaultUsername) {
        globalStore.appendNotification("Please, fill the connection form correctly!", NotificationType.ERROR);
        return;
    }

    let client: DocSocketClient|null = null;

    switch (globalStore.defaultService) {
        case 'colyseus':
            client = new ColyseusClient(globalStore.defaultAddress, globalStore.defaultRoom, globalStore.defaultUsername);
            break;
        case 'socketio':
            client = new SocketIOClient(globalStore.defaultAddress, globalStore.defaultUsername);
            break;
        case 'websocket':
            client = new WebSocketClient(globalStore.defaultAddress, globalStore.defaultUsername);
            break;
    }

    if (client) {
        projectStore.setClient(client);
        globalStore.save();
    }

    modalsStore.closeModal();
}
</script>

<template>
    <Modal id="connection-modal">
        <form @submit.prevent="connect" id="login">
            <div class="subtitle is-4">Service connection</div>

            <div class="field">
                <label class="label">Server address</label>

                <div class="control">
                    <input v-model="globalStore.defaultAddress" type="text" class="input" id="address" placeholder="ws(s)://">
                </div>
            </div>

            <div class="field">
                <label class="label">Service</label>

                <div class="select">
                    <select v-model="globalStore.defaultService" id="client">
                        <option value="colyseus">Colyseus</option>
                        <option value="socketio">Socket.io</option>
                        <option value="websocket">Web socket</option>
                    </select>
                </div>
            </div>

            <div class="field">
                <label class="label">Room name</label>

                <div class="control">
                    <input v-model="globalStore.defaultRoom" type="text" id="room-name" class="input">
                </div>
            </div>

            <div class="field">
                <label class="label">Username</label>

                <div class="control">
                    <input v-model="globalStore.defaultUsername" type="text" id="username" class="input">
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link">Connect</button>
                </div>
            </div>
        </form>
    </Modal>
</template>