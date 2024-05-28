<script setup lang="ts">
import {useModalsStore} from "../storages/modals.ts";

const props = defineProps(['id']);
const emit = defineEmits(['onClose']);
const store = useModalsStore();

function close() {
    store.closeModal();
    emit('onClose');
}
</script>

<template>
    <div :id="props.id" class="modal" :class="{'is-active': store.modalOpened(id)}">
        <div @click="close" class="modal-background"></div>
        <div class="modal-card">
            <button @click="close" class="delete" aria-label="close"></button>
            <section class="modal-card-body">
                <slot></slot>
            </section>
        </div>
    </div>
</template>