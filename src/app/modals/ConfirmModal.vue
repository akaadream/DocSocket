<script setup lang="ts">
import Modal from "./Modal.vue";
import {useModalsStore} from "../storages/modals.ts";
import {useGlobalStore} from "../storages/global.ts";
import {NotificationType} from "../../utils/Notification.ts";

const globalStore = useGlobalStore();
const modalsStore = useModalsStore();
const props = defineProps(['id', 'messageName']);

function confirm() {
    globalStore.currentProject?.tryDelete(props.messageName);
    globalStore.appendNotification("The message has been successfully deleted!", NotificationType.SUCCESS);
}
</script>

<template>
    <Modal :id="props.id">
        <div class="subtitle is-4">Do you really want to delete the {{ props.messageName }} message?</div>
        <div class="field">
            <div class="control buttons">
                <button @click.prevent="modalsStore.closeModal()" class="button">Cancel</button>
                <button @click.prevent="confirm" class="button is-success">Confirm</button>
            </div>
        </div>
    </Modal>
</template>