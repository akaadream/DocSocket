<script setup lang="ts">
import Icon from "../components/Icon.vue";
import {useGlobalStore} from "../storages/global.ts";

const globalStore = useGlobalStore();
const props = defineProps(['projectName', 'projectSlug']);

function selectProject() {
    globalStore.selectProject(props.projectName);
}

function deleteProject() {
    globalStore.deleteProject(props.projectName);
}
</script>

<template>
    <a href="#" @click.prevent="selectProject" :data-project.attr="props.projectSlug" class="nav-link" :class="{
        'is-selected': globalStore.currentProject ? globalStore.currentProject.name === projectName : false
    }">
        <div class="is-flex is-align-content-center">
            <Icon style="margin-right: 8px" name="folder" />
            {{ props.projectName }}
        </div>

        <button @click.stop.prevent="deleteProject" class="button">
            <Icon name="delete" />
        </button>
    </a>
</template>