<script setup lang="ts">
import Modal from "./Modal.vue";
import {useGlobalStore} from "../storages/global.ts";
import {NotificationType} from "../../utils/Notification.ts";
import {useProjectStore} from "../storages/project.ts";

const globalStore = useGlobalStore();
const projectStore = useProjectStore();

function copyExport() {
    navigator.clipboard.writeText(projectStore.documentation).then(() => {
        globalStore.appendNotification('The documentation has been copied to the clipboard!', NotificationType.SUCCESS);
    }).catch(() => {
        globalStore.appendNotification('The documentation cannot be copied to the clipboard!', NotificationType.ERROR);
    });
}
</script>

<template>
    <Modal id="export-modal">
        <div class="subtitle is-4">Documentation exportation</div>

        <div id="exportation">
            <pre v-html="projectStore.getHighlighted()" id="export-pre" class="export-pre" @click="copyExport" />
        </div>
    </Modal>
</template>