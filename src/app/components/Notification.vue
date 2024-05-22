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
const timeoutId = ref(-1);

onMounted(() => {
    timeoutId.value = setTimeout(() => {
        timeoutId.value = -1;
        remove();
    }, 4000);
});

function remove() {
    const globalStorage = useGlobalStore();
    globalStorage.notifications.splice(props.index, 1);
}
</script>

<template>
<div class="notification" :class="{
    'is-success': props.type === NotificationType.SUCCESS,
    'is-danger': props.type === NotificationType.ERROR
}">
    <div class="delete" @click="remove"></div>
    {{ props.content }}
</div>
</template>