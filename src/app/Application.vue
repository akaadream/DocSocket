<script setup lang="ts">
import Menu from "./menu/Menu.vue";
import CreateProjectModal from "./modals/CreateProjectModal.vue";
import ConnectionModal from "./modals/ConnectionModal.vue";
import EditMessageModal from "./modals/EditMessageModal.vue";
import ExportModal from "./modals/ExportModal.vue";
import MessageModal from "./modals/MessageModal.vue";
import {useModalsStore} from "./storages/modals.ts";
import Notification from "./components/Notification.vue";
import {useGlobalStore} from "./storages/global.ts";
import {onMounted} from "vue";

const globalStore = useGlobalStore();
const modalsStore = useModalsStore();

/**
 * Clear the content from the local storage
 */
function deleteLocalStorage() {
    if (confirm("Do you really want to clear the local storage?")) {
        localStorage.clear();
    }
}

/**
 * Check if the espace key is pressed and if it's the case, close the current opened modal
 * @param event
 */
function handleKeyboard(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        modalsStore.closeModal();
    }
}

/**
 * When the app is mounted, load the local storage data
 */
onMounted(() => {
    globalStore.appStorage.load();
});
</script>

<template>
    <Menu />

    <div id="notifications">
        <Notification v-for="(notification, index) in globalStore.notifications"
                      :index="index"
                      :type="notification.type"
                      :content="notification.content"
        />
    </div>

    <div class="modals">
        <CreateProjectModal />
        <ConnectionModal />
        <MessageModal />
        <EditMessageModal />
        <ExportModal />
    </div>

    <div class="app-content" @keydown="handleKeyboard">
        <div class="columns">
            <div class="column">
                <div class="title">
                    Doc<span class="title-thin">ket</span>
                </div>

                <div id="connection" class="connection-status" :class="{
                    'connected': globalStore.client && globalStore.client.connected
                }">
                    <span v-if="globalStore.client && globalStore.client.connected" id="connection-text" class="connection-text">Connected</span>
                    <span v-else id="connection-text" class="connection-text">Disconnected</span>
                    <span class="connection-indicator"></span>
                </div>
            </div>

            <div class="column is-right spaced">
                <button id="open-message-modal" @click="modalsStore.open('project-modal')" class="button expand-button modal-opening-button" data-target="project-modal">
                    <span class="icon">
                        <i class="fas fa-plus"></i>
                    </span>

                    <span class="text">
                        New project
                    </span>
                </button>
            </div>
        </div>

        <div class="buttons spaced">
            <button id="open-connection-modal" @click="modalsStore.open('connection-modal')" class="button modal-opening-button" data-target="connection-modal">
                <span class="icon">
                    <i class="fa-solid fa-right-to-bracket"></i>
                </span>

                <span class="text">
                    Connect to the server
                </span>
            </button>
            <button id="open-message-modal" @click="modalsStore.open('message-modal')" class="button modal-opening-button" data-target="message-modal">
                <span class="icon">
                    <i class="fa-solid fa-plus"></i>
                </span>

                <span class="text">
                    Add a new message
                </span>
            </button>
        </div>

        <div class="columns">
            <div class="column">
                <div id="template-messages" class="output" :class="{
                    'disconnected': !globalStore.client || !globalStore.client.connected
                }">
                </div>

                <div class="buttons">
                    <button id="export" class="button modal-opening-button" data-target="export-modal">
                    <span class="icon">
                        <i class="fa-solid fa-file-export"></i>
                    </span>

                        <span class="text">
                        Export documentation
                    </span>
                    </button>
                    <button id="reset" class="button is-danger" @click="deleteLocalStorage">
                    <span class="icon">
                        <i class="fa-solid fa-trash"></i>
                    </span>

                        <span class="text">
                        Delete local storage
                    </span>
                    </button>
                </div>
            </div>

            <div class="column">
                <div id="messages" class="output">
                </div>
            </div>
        </div>
    </div>
</template>