<script setup lang="ts">
import Modal from "./Modal.vue";
import {useModalsStore} from "../storages/modals.ts";

const store = useModalsStore();
function createNewProject() {
    // TODO: create a new project

    store.closeModal();
}
</script>

<template>
    <Modal id="project-modal">
        <form id="create-project">
            <div class="subtitle is-4">Create a new project</div>

            <div class="field">
                <label class="label">Name</label>

                <div class="control">
                    <input type="text" class="input" id="project-name">
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button @click.prevent="createNewProject" class="button is-link">Create</button>
                </div>
            </div>
        </form>
    </Modal>
</template>