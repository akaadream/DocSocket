<script setup lang="ts">
import {useModalsStore} from "../storages/modals.ts";

const props = defineProps(['label', 'modalName', 'icon']);
const modalsStore = useModalsStore();
</script>

<template>
    <button @click="modalsStore.open(props.modalName)" class="button expand-button modal-opening-button">
        <span class="icon">
            <i class="fas" :class="props.icon"></i>
        </span>

        <span class="text">
            {{ props.label }}
        </span>
    </button>
</template>