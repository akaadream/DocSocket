<script setup lang="ts">
import Modal from "./Modal.vue";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import {useGlobalStore} from "../storages/global.ts";
import {NotificationType} from "../../utils/Notification.ts";

hljs.registerLanguage('json', json);

const globalStore = useGlobalStore();
const props = defineProps(['content']);
const highlighted = hljs.highlight(props.content, {
    language: 'json'
});

function copyExport() {
    navigator.clipboard.writeText(props.content).then(() => {
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
            <pre v-html="highlighted.value" id="export-pre" class="export-pre" @click="copyExport" />
        </div>
    </Modal>
</template>