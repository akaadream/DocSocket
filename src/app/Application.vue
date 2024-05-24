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
import TemplateMessage from "./components/TemplateMessage.vue";
import {Project} from "./Project.ts";
import ModalButton from "./components/ModalButton.vue";
import Message from "./components/Message.vue";
import Icon from "./components/Icon.vue";

const globalStore = useGlobalStore();
const modalsStore = useModalsStore();

// TODO: some store elements seems not updating the page when they are modified like pushing a new output message
// TODO: or when we want to detect if the client is disconnected or not

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
    globalStore.load();
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
        <EditMessageModal v-if="globalStore.currentProject" :message="globalStore.currentProject" />
        <ExportModal v-if="globalStore.currentProject" :content="globalStore.getExport()" />
    </div>

    <div class="app-content" @keydown="handleKeyboard">
        <div class="columns">
            <div class="column">
                <div class="title">
                    Doc<span class="title-thin">ket</span>
                </div>

                <div v-if="globalStore.currentProject" id="connection" class="connection-status" :class="{
                    'connected': globalStore.clientConnected()
                }">
                    <span v-if="globalStore.clientConnected()" id="connection-text" class="connection-text">Connected</span>
                    <span v-else id="connection-text" class="connection-text">Disconnected</span>
                    <span class="connection-indicator"></span>
                </div>
            </div>

            <div class="column is-right">
                <ModalButton label="New project" modal-name="project-modal" icon="add" />
            </div>
        </div>

        <div v-if="globalStore.currentProject" class="buttons spaced">
            <ModalButton v-if="!globalStore.clientConnected()" label="Connect to the server" modal-name="connection-modal" icon="login" />
            <button id="disconnect" class="button" @click="globalStore.disconnectFromClient()">
                <Icon name="logout" />
                Disconnect from the server
            </button>
            <ModalButton label="Add a new message" modal-name="message-modal" icon="add_circle" />
        </div>

        <div v-if="globalStore.currentProject" class="columns">
            <div class="column">
                <div id="template-messages" class="output" :class="{
                    'disconnected': !globalStore.clientConnected()
                }">
                    <div class="subtitle is-5">Template messages</div>
                    <TemplateMessage
                        v-for="message in (globalStore.currentProject as Project).messages"
                        :identifier="message.id"
                        :args="message.args"
                        :name="message.name"
                        :type="message.type"
                    />
                </div>

                <div class="buttons">
                    <ModalButton label="Export documentation" modal-name="export-modal" icon="share" />

                    <button id="reset" class="button is-danger" @click="deleteLocalStorage">
                        <Icon name="delete" />
                        Delete local storage
                    </button>
                </div>
            </div>

            <div class="column">
                <div id="messages" class="output">
                    <div class="subtitle is-5">Output messages</div>
                    <Message
                        v-if="globalStore.clientConnected()"
                        v-for="message in globalStore.getMessages()"
                        :content="message.content"
                        :name="message.name"
                        :type="message.type" />
                </div>
            </div>
        </div>
    </div>
</template>