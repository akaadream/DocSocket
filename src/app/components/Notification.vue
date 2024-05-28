<script setup lang="ts">
import {NotificationType} from "../../utils/Notification.ts";
import {onMounted, ref} from "vue";
import {useGlobalStore} from "../storages/global.ts";

export interface NotificationProps {
    index: number;
    type: NotificationType;
    content: string;
}

const props = defineProps<NotificationProps>();
const timeoutId = ref(-999);
const fade = ref(false);

onMounted(() => {
    timeoutId.value = setTimeout(() => {
        timeoutId.value = -999;
        fadeOut();
    }, 4000);
});

function fadeOut() {
    fade.value = true;
    if (timeoutId.value !== -999) {
        clearTimeout(timeoutId.value);
    }
    setTimeout(() => {
        remove();
    }, 1000);
}

function remove() {
    const globalStorage = useGlobalStore();
    globalStorage.notifications.splice(props.index, 1);
}
</script>

<template>
<div class="notification" :class="{
    'is-success': props.type === NotificationType.SUCCESS,
    'is-danger': props.type === NotificationType.ERROR,
    'fade-out': fade
}">
    <div class="delete" @click="fadeOut"></div>
    {{ props.content }}
</div>
</template>