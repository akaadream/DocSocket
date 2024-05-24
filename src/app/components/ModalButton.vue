<script setup lang="ts">
import {useModalsStore} from "../storages/modals.ts";

const props = defineProps(['label', 'modalName', 'icon']);
const modalsStore = useModalsStore();
</script>

<template>
    <button @click="modalsStore.open(props.modalName)" class="button expand-button modal-opening-button">
        <span class="icon">
            <span class="material-icons">{{ props.icon }}</span>
        </span>

        <span class="text">
            {{ props.label }}
        </span>
    </button>
</template>