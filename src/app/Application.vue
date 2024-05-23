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
import {onMounted, ref, Ref, watch} from "vue";
import TemplateMessage from "./components/TemplateMessage.vue";
import {Project} from "./Project.ts";
import ModalButton from "./components/ModalButton.vue";
import Message from "./components/Message.vue";
import {MessageType} from "../utils/Message.ts";

const globalStore = useGlobalStore();
const modalsStore = useModalsStore();

watch(globalStore.currentProject, (newProject, oldProject) => {
    console.log("old:", oldProject);
    console.log("new:", newProject);
});

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

                <div v-if="globalStore.currentProject" id="connection" class="connection-status" :class="{
                    'connected': globalStore.client && globalStore.client.connected
                }">
                    <span v-if="globalStore.client && globalStore.client.connected" id="connection-text" class="connection-text">Connected</span>
                    <span v-else id="connection-text" class="connection-text">Disconnected</span>
                    <span class="connection-indicator"></span>
                </div>
            </div>

            <div class="column is-right">
                <ModalButton label="New project" modal-name="project-modal" icon="fa-plus" />
            </div>
        </div>

        <div v-if="globalStore.currentProject" class="buttons spaced">
            <ModalButton v-if="!globalStore.client" label="Connect to the server" modal-name="connection-modal" icon="fa-right-to-bracket" />
            <ModalButton label="Add a new message" modal-name="message-modal" icon="fa-plus" />
        </div>

        <div v-if="globalStore.currentProject" class="columns">
            <div class="column">
                <div id="template-messages" class="output" :class="{
                    'disconnected': !globalStore.client || !globalStore.client.connected
                }">
                    <TemplateMessage v-for="message in (globalStore.currentProject as Project).messages" :args="message.args" :name="message.name" />
                </div>

                <div class="buttons">
                    <ModalButton label="Export documentation" modal-name="export-modal" icon="fa-file-export" />

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
                    <Message v-for="message in globalStore.messages" :content="message.content" :name="message.name" :type="MessageType[message.type]" />
                </div>
            </div>
        </div>
    </div>
</template>