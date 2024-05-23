<script setup lang="ts">
import NavItem from "./NavItem.vue";
import {useGlobalStore} from "../storages/global.ts";

const globalStore = useGlobalStore();
</script>

<template>
    <div class="nav">
        <div class="nav-title subtitle is-5">Projects</div>

        <div id="nav" class="nav-links">
            <NavItem v-for="project in globalStore.projects" :project-name="project.name" :project-slug="project.slug" />
        </div>
    </div>
</template>