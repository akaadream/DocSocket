<script setup lang="ts">
import {useGlobalStore} from "../storages/global.ts";
import Modal from "./Modal.vue";

const globalStore = useGlobalStore();
function editMessage() {
    // const message = appStorage.message[id];
    // message.edit(name, args, type)
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
                    <div id="edit-message-editor-content" class="cm-editor">
                    </div>
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