<script setup lang="ts">

import {ref} from "vue";
import Modal from "./Modal.vue";

const code = ref("");

function copyExport() {
    navigator.clipboard.writeText(code.value).then(() => {
        // TODO: push a success notification
    }).catch(() => {
        // TODO: push an error notification
    });
}
</script>

<template>
    <Modal id="export-modal">
        <div class="subtitle is-4">Messages exportation</div>

        <div id="exportation">
            <pre id="export-pre" class="export-pre" @click="copyExport">
                <code v-bind="code" id="export-code" class="export-code">

                </code>
            </pre>
        </div>
    </Modal>
</template>