<script setup lang="ts">
import Modal from "./Modal.vue";
import {useModalsStore} from "../storages/modals.ts";
import {useGlobalStore} from "../storages/global.ts";
import {Project} from "../Project.ts";
import {ref} from "vue";

const globalStore = useGlobalStore();
const modalsStore = useModalsStore();

const projectName = ref("");

function createNewProject() {
    // TODO: create a new project
    if (projectName) {
        const project = new Project(projectName.value);
        globalStore.projects.push(project);
        globalStore.currentProject = project;

        modalsStore.closeModal();
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