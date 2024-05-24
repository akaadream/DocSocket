<script setup lang="ts">
import Modal from "./Modal.vue";
import {useModalsStore} from "../storages/modals.ts";
import {useGlobalStore} from "../storages/global.ts";
import {ref} from "vue";
import {NotificationType} from "../../utils/Notification.ts";

const globalStore = useGlobalStore();
const modalsStore = useModalsStore();

const projectName = ref("");

function createNewProject() {
    if (projectName.value) {
        globalStore.createProject(projectName.value);
        modalsStore.closeModal();
    }
    else {
        globalStore.appendNotification("Please enter a project name!", NotificationType.ERROR);
    }
}
</script>

<template>
    <Modal id="project-modal">
        <form id="create-project">
            <div class="subtitle is-4">Create a new project</div>

            <div class="field">
                <label class="label">Name</label>

                <div class="control">
                    <input v-model="projectName" type="text" class="input" id="project-name">
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