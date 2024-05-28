<script setup lang="ts">
import Modal from "./Modal.vue";
import {ref} from "vue";
import {TemplateMessageType} from "../../utils/TemplateMessage.ts";
import {useGlobalStore} from "../storages/global.ts";
import {useModalsStore} from "../storages/modals.ts";
import VueCodemirror from "../components/VueCodemirror.vue";
import {NotificationType} from "../../utils/Notification.ts";
import {useProjectStore} from "../storages/project.ts";

const globalStore = useGlobalStore();
const projectStore = useProjectStore();
const modalsStore = useModalsStore();

const messageName = ref("");
const messageType = ref("request");
const messageArgs = ref("");

function createMessage() {
    if (!messageName.value || !messageArgs.value || !messageType.value || !projectStore.selected()) {
        return;
    }

    const message = projectStore.addTemplate(
        messageName.value,
        messageArgs.value,
        messageType.value === 'request' ? TemplateMessageType.REQUEST : TemplateMessageType.RESPONSE);

    if (message) {
        globalStore.appendNotification("The template message has successfully been added!", NotificationType.SUCCESS);
        modalsStore.closeModal();
    }
    else {
        globalStore.appendNotification("Unexpected error while creating the template message!", NotificationType.ERROR);
    }
}

function onUpdate(value: string) {
    messageArgs.value = value;
}
</script>

<template>
    <Modal id="message-modal">
        <form @submit.prevent="createMessage" id="add-message">
            <div class="subtitle is-4">Create a new message</div>

            <div class="field">
                <label class="label">Name</label>

                <div class="control">
                    <input v-model="messageName" id="message-name" type="text" class="input">
                </div>

                <p v-if="projectStore.templateAlreadyExists(messageName, messageType)" class="help is-danger">A message template with this name already exists</p>
            </div>

            <div class="field">
                <label class="label">Type</label>

                <div class="select">
                    <select v-model="messageType" id="message-type">
                        <option value="request">Request</option>
                        <option value="response">Response</option>
                    </select>
                </div>
            </div>

            <div class="field">
                <label class="label">Content</label>

                <div class="control">
                    <VueCodemirror @update:modelValue="onUpdate" code="" />
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button :disabled="projectStore.templateAlreadyExists(messageName, messageType)" class="button is-link">Add the message</button>
                </div>
            </div>
        </form>
    </Modal>
</template>