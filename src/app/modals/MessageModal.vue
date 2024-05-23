<script setup lang="ts">
import Modal from "./Modal.vue";
import {onMounted, Ref, ref} from "vue";
import {TemplateMessage, TemplateMessageType} from "../../utils/TemplateMessage.ts";
import {useGlobalStore} from "../storages/global.ts";
import {useModalsStore} from "../storages/modals.ts";
import VueCodemirror from "../components/VueCodemirror.vue";
import {ViewUpdate} from "@codemirror/view";

const globalStore = useGlobalStore();
const modalsStore = useModalsStore();

const messageName = ref("");
const messageType = ref("request");
const messageArgs = ref("");

function createMessage() {
    if (!messageName.value || !messageArgs.value || !messageType.value || !globalStore.currentProject) {
        return;
    }

    const templateMessage = new TemplateMessage(messageName.value, messageArgs.value, messageType.value === 'request' ? TemplateMessageType.REQUEST : TemplateMessageType.RESPONSE);
    globalStore.currentProject.messages.push(templateMessage);
    globalStore.appStorage.save();
    modalsStore.closeModal();
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
                    <VueCodemirror @update:modelValue="onUpdate" />
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link">Add the message</button>
                </div>
            </div>
        </form>
    </Modal>
</template>