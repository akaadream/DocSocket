<script setup lang="ts">
import Modal from "./Modal.vue";
import {useModalsStore} from "../storages/modals.ts";

const modalsStore = useModalsStore();
const props = defineProps(['id', 'messageName']);
const emit = defineEmits(['confirm']);
</script>

<template>
    <Modal :id="props.id">
        <div class="subtitle is-4">Do you really want to delete {{ props.messageName }}?</div>
        <div class="field">
            <div class="control buttons">
                <button @click.prevent="modalsStore.closeModal()" class="button">Cancel</button>
                <button @click.prevent="emit('confirm')" class="button is-success">Confirm</button>
            </div>
        </div>
    </Modal>
</template>