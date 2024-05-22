<script setup lang="ts">
import {ref} from "vue";
import Modal from "./Modal.vue";
import {useGlobalStore} from "../storages/global.ts";
import {ColyseusClient} from "../../clients/ColyseusClient.ts";
import {WebSocketClient} from "../../clients/WebSocketClient.ts";
import {SocketIOClient} from "../../clients/SocketIOClient.ts";
import {Notification} from "../../utils/Notification.ts";
import {NotificationType} from "../../utils/Notification.ts";
import {DocSocketClient} from "../../clients/DocSocketClient.ts";
import {useModalsStore} from "../storages/modals.ts";

const address = ref("");
const service = ref("colyseus");
const roomName = ref("");
const username = ref("");

function connect() {
    if (!roomName.value || !service.value || !address.value || !username.value) {
        // TODO: add a new notification
        return;
    }

    const globalStore = useGlobalStore();
    const modalsStore = useModalsStore();
    let client: DocSocketClient|null = null;

    switch (service.value) {
        case 'colyseus':
            client = new ColyseusClient(address.value, roomName.value, username.value);
            break;
        case 'socketio':
            client = new SocketIOClient(address.value, username.value);
            break;
        case 'websocket':
            client = new WebSocketClient(address.value, username.value);
            break;
    }

    if (client && client.connected) {
        globalStore.setClient(client);
        globalStore.notifications.push(new Notification("Successfully connected on the service!", NotificationType.SUCCESS));
        console.log("notification pushed");
        // TODO: save the app local storage
    }
    else {

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
                    <input v-model="address" type="text" class="input" id="address" placeholder="ws(s)://">
                </div>
            </div>

            <div class="field">
                <label class="label">Service</label>

                <div class="select">
                    <select v-model="service" id="client">
                        <option value="colyseus">Colyseus</option>
                        <option value="socketio">Socket.io</option>
                        <option value="websocket">Web socket</option>
                    </select>
                </div>
            </div>

            <div class="field">
                <label class="label">Room name</label>

                <div class="control">
                    <input v-model="roomName" type="text" id="room-name" class="input">
                </div>
            </div>

            <div class="field">
                <label class="label">Username</label>

                <div class="control">
                    <input v-model="username" type="text" id="username" class="input">
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