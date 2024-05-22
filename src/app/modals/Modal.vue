<script setup lang="ts">
import {useModalsStore} from "../storages/modals.ts";

const props = defineProps(['id']);
const store = useModalsStore();
</script>

<template>
    <div :id="props.id" class="modal" :class="{'is-active': store.modalOpened(id)}">
        <div @click="store.closeModal()" class="modal-background"></div>
        <div class="modal-card">
            <button @click="store.closeModal()" class="delete" aria-label="close"></button>
            <section class="modal-card-body">
                <slot></slot>
            </section>
        </div>
    </div>
</template>