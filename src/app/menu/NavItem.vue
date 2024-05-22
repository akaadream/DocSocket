<script setup lang="ts">
import Icon from "../components/Icon.vue";

const props = defineProps(['projectName', 'projectSlug']);
</script>

<template>
    <a href="#" :data-project.attr="props.projectSlug" class="nav-link">
        <Icon name="fa-folder" />
        {{ props.projectName }}
    </a>
</template>