<script setup lang="ts">
import Icon from "./Icon.vue";

export interface TemplateMessageProps {
    name: string;
    args: string;
}

const props = defineProps<TemplateMessageProps>();
</script>

<template>
    <div class="message-template">
        <div class="message-template-infos">
            <div class="message-template-name tag is-medium is-link">
                {{ props.name }}
            </div>

            <div class="buttons has-addons">
                <button class="button is-dark">
                    <Icon name="fa-play" aria-hidden="true" />
                </button>

                <button class="button is-dark modal-opening-button" data-target="edit-message-modal">
                    <Icon name="fa-pen-to-square" aria-hidden="true" />
                </button>

                <button class="button is-danger is-dark">
                    <Icon name="fa-trash" aria-hidden="true" />
                </button>
            </div>
        </div>
    </div>
</template>