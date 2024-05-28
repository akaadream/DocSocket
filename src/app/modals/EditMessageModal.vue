<script setup lang="ts">
import {useGlobalStore} from "../storages/global.ts";
import Modal from "./Modal.vue";
import VueCodemirror from "../components/VueCodemirror.vue";
import {ref} from "vue";
import {useProjectStore} from "../storages/project.ts";
import {TemplateMessageType} from "../../utils/TemplateMessage.ts";

export interface TemplateMessageProps {
    name: string;
    args: string;
    type: string;
}
const props = defineProps<TemplateMessageProps>();
const emit = defineEmits(['edit']);

const globalStore = useGlobalStore();
const projectStore = useProjectStore();

const previousName = ref(props.name);
const nextName = ref(props.name);
const args = ref(props.args);
const type = ref(props.type);

function onUpdate(value: string) {
    args.value = value;
}

function onClose() {
    projectStore.selectedMessage = undefined;
}

function edit() {
    emit('edit', {
        name: nextName.value,
        args: args.value,
        type: type.value === 'request' ? TemplateMessageType.REQUEST : TemplateMessageType.RESPONSE
    });
}
</script>

<template>
    <Modal @on-close="onClose" id="edit-message-modal" data-message="0">
        <form @submit.prevent="edit" id="add-message">
            <div class="subtitle is-4">Edit an existing message</div>

            <div class="field">
                <label class="label">Name</label>

                <div class="control">
                    <input v-model="nextName" id="edit-message-name" type="text" class="input">
                </div>
            </div>

            <div class="field">
                <label class="label">Type</label>

                <div class="select">
                    <select v-model="type" id="edit-message-type">
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