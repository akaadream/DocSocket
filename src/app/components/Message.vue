<script setup lang="ts">
import Icon from "./Icon.vue";
import {MessageType} from "../../utils/Message.ts";
import {ref} from "vue";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/*";

hljs.registerLanguage('json', json);

export interface MessageProps {
    name: string;
    content: string;
    type: MessageType;
}

const props = defineProps<MessageProps>();
const opened = ref(false);
const highlighted = hljs.highlight(props.content, {
    language: 'json'
});

function toggleOpen() {
    opened.value = !opened.value;
}
</script>

<template>
    <div class="message">
        <div class="message-header" @click="toggleOpen">
            <div class="message-name tag is-medium" :class="{
                'is-success': props.type === MessageType.RESPONSE,
                'is-warning': props.type === MessageType.REQUEST,
                'is-danger': props.type === MessageType.ERROR
            }">
                {{ props.name }}
            </div>

            <div class="message-type">
                {{ MessageType[props.type] }}
            </div>

            <div class="message-dropdown">
                <Icon name="fa-caret-down" />
            </div>
        </div>

        <div class="message-content">
            <pre>
                <code class="language-json">
                    {{ highlighted }}
                </code>
            </pre>
        </div>
    </div>
</template>