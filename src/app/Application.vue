<script setup lang="ts">
import Menu from "./menu/Menu.vue";
import CreateProjectModal from "./modals/CreateProjectModal.vue";
import ConnectionModal from "./modals/ConnectionModal.vue";
import ExportModal from "./modals/ExportModal.vue";
import MessageModal from "./modals/MessageModal.vue";
import {useModalsStore} from "./storages/modals.ts";
import Notification from "./components/Notification.vue";
import {useGlobalStore} from "./storages/global.ts";
import {onMounted} from "vue";
import TemplateMessage from "./components/TemplateMessage.vue";
import ModalButton from "./components/ModalButton.vue";
import Message from "./components/Message.vue";
import Icon from "./components/Icon.vue";
import {useProjectStore} from "./storages/project.ts";
import {NotificationType} from "../utils/Notification.ts";

const globalStore = useGlobalStore();
const projectStore = useProjectStore();
const modalsStore = useModalsStore();

/**
 * Clear the content from the local storage
 */
function deleteLocalStorage() {
    if (confirm("Do you really want to clear the local storage?")) {
        globalStore.clear();
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
 * Clear test messages output
 * @param event
 */
function clearOutput(event: Event) {
    event.preventDefault();

    projectStore.clearMessages();
}

/**
 * When the app is mounted, load the local storage data
 */
onMounted(() => {
    globalStore.load();

    addEventListener('client:room_joined', () => {
        projectStore.listen();
    });
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
        <ExportModal v-if="projectStore.selected()" />
    </div>

    <div class="app-content" @keydown="handleKeyboard">
        <div class="columns">
            <div class="column">
                <div class="title">
                    Doc<span class="title-thin">ket</span>
                    <span class="tag is-dark is-rounded"> beta </span>
                </div>

                <div v-if="projectStore.selected()" id="connection" class="connection-status" :class="{
                    'connected': projectStore.connected()
                }">
                    <span v-if="projectStore.connected()" id="connection-text" class="connection-text">Connected</span>
                    <span v-else id="connection-text" class="connection-text">Disconnected</span>
                    <span class="connection-indicator"></span>
                </div>
            </div>

            <div class="column is-right">
                <ModalButton label="New project" modal-name="project-modal" icon="add" />
            </div>
        </div>

        <div v-if="projectStore.selected()" class="buttons spaced">
            <ModalButton v-if="!projectStore.connected()" label="Connect to the server" modal-name="connection-modal" icon="login" />
            <button v-if="projectStore.connected()" id="disconnect" class="button" @click="projectStore.disconnect()">
                <Icon name="logout" />
                Disconnect from the server
            </button>
            <ModalButton label="Add a new message" modal-name="message-modal" icon="add_circle" />
        </div>

        <div v-if="projectStore.selected()" class="columns">
            <div class="column">
                <div id="template-messages" class="output" :class="{
                    'disconnected': !projectStore.connected()
                }">
                    <div class="subtitle is-5">Template messages</div>
                    <TemplateMessage
                        v-for="message in projectStore.templates"
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
                    <button id="clear-button" class="button" @click="clearOutput">
                        <Icon name="delete" />
                    </button>
                    <div class="subtitle is-5">Output messages</div>
                    <Message
                        v-if="projectStore.connected()"
                        v-for="message in projectStore.messages"
                        :content="message.content"
                        :name="message.name"
                        :type="message.type" />
                </div>
            </div>
        </div>
    </div>
</template>