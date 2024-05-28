<script setup lang="ts">
import Icon from "./Icon.vue";
import {useGlobalStore} from "../storages/global.ts";
import {TemplateMessageType} from "../../utils/TemplateMessage.ts";
import ConfirmModal from "../modals/ConfirmModal.vue";
import {useModalsStore} from "../storages/modals.ts";
import {NotificationType} from "../../utils/Notification.ts";
import {useProjectStore} from "../storages/project.ts";
import EditMessageModal from "../modals/EditMessageModal.vue";

const globalStore = useGlobalStore();
const projectStore = useProjectStore();
const modalsStore = useModalsStore();

export interface TemplateMessageProps {
    identifier: number;
    name: string;
    args: string;
    type: TemplateMessageType;
}

export interface EditTemplateMessage {
    name: string;
    args: string;
    type: TemplateMessageType;
}

const props = defineProps<TemplateMessageProps>();

function test() {
    if (props.type === TemplateMessageType.REQUEST) {
        projectStore.client?.request(props.name, props.args);
    }
}

function edit() {
    projectStore.selectMessage(props.name, props.type);
    modalsStore.open(`edit-template-${props.identifier}`);
}

function remove() {
    modalsStore.open(`message-template-${props.identifier}`);
}

function confirm() {
    if (projectStore.deleteTemplate(props.name)) {
        globalStore.appendNotification("The message has been successfully deleted!", NotificationType.SUCCESS);
    }
    else {
        globalStore.appendNotification("The message template cannot be deleted!", NotificationType.ERROR);
    }
}

/**
 * Update an existing template message with the form values
 * @param editedMessage
 */
function update(editedMessage: EditTemplateMessage) {
    // TODO: the edited message modal got issues (the edited message is considered as existing message)
    // TODO: when we create a new message, the added message is duplicated
    projectStore.editTemplate(
        props.name,
        props.type,
        editedMessage.name,
        editedMessage.args,
        editedMessage.type);
    modalsStore.closeModal();
}
</script>

<template>
    <ConfirmModal @confirm="confirm" :id="`message-template-${props.identifier}`" :message-name="props.name" />
    <EditMessageModal
        @edit="update"
        :id="`edit-template-${props.identifier}`"
        :name="props.name ?? ''"
        :args="props.args ?? ''"
        :type="props.type === TemplateMessageType.REQUEST ? 'request' : 'response' ?? 'request'"
    />

    <div :id="props.identifier" class="message-template">
        <div class="message-template-infos">
            <div class="message-template-name tag is-medium" :class="{
                'is-warning': props.type === TemplateMessageType.REQUEST,
                'is-success': props.type === TemplateMessageType.RESPONSE
            }">
                {{ props.name }}
            </div>
        </div>

        <div class="buttons has-addons">
            <button v-if="props.type === TemplateMessageType.REQUEST" @click.prevent.stop="test" class="button is-dark">
                <Icon name="play_arrow" aria-hidden="true" />
            </button>

            <button @click.prevent.stop="edit" class="button is-dark modal-opening-button" data-target="edit-message-modal">
                <Icon name="edit" aria-hidden="true" />
            </button>

            <button @click.prevent.stop="remove" class="button is-danger is-dark">
                <Icon name="delete" aria-hidden="true" />
            </button>
        </div>
    </div>
</template>