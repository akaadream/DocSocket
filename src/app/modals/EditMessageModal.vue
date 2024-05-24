<script setup lang="ts">
import {useGlobalStore} from "../storages/global.ts";
import Modal from "./Modal.vue";
import VueCodemirror from "../components/VueCodemirror.vue";
import {ref} from "vue";
import {TemplateMessage, TemplateMessageType} from "../../utils/TemplateMessage.ts";

export interface EditMessageProps {
    message: TemplateMessage
}

const props = defineProps<EditMessageProps>();

const globalStore = useGlobalStore();
const name = ref(props.message.name ?? "");
const args = ref(props.message.args ?? "");
const type = ref(TemplateMessageType[props.message.type] ?? TemplateMessageType.REQUEST);

function editMessage() {
    const message: TemplateMessage|undefined = globalStore.currentProject?.messages[props.message.id];
    if (message) {
        message.edit(name.value, args.value, type.value === 'request' ? TemplateMessageType.REQUEST : TemplateMessageType.RESPONSE);
        // TODO: push a notification
    }
}

function onUpdate(value: string) {
    args.value = value;
}
</script>

<template>
    <Modal id="edit-message-modal" data-message="0">
        <form @submit.prevent="editMessage" id="add-message">
            <div class="subtitle is-4">Edit an existing message</div>

            <div class="field">
                <label class="label">Name</label>

                <div class="control">
                    <input id="edit-message-name" type="text" class="input">
                </div>
            </div>

            <div class="field">
                <label class="label">Type</label>

                <div class="select">
                    <select id="edit-message-type">
                        <option value="request">Request</option>
                        <option value="response">Response</option>
                    </select>
                </div>
            </div>

            <div class="field">
                <label class="label">Content</label>

                <div class="control">
                    <VueCodemirror @update:modelValue="onUpdate" :code="args" />
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-link">Edit the message</button>
                </div>
            </div>
        </form>
    </Modal>
</template>