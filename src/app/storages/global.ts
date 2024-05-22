import {defineStore} from "pinia";
import {Ref, ref} from "vue";
import {Project} from "../Project.ts";
import {Notification} from "../../utils/Notification.ts";
import {DocSocketClient} from "../../clients/DocSocketClient.ts";
import {AppStorage} from "../../utils/AppStorage.ts";

export const useGlobalStore = defineStore('global', () => {
    const projects: Ref<Project[]> = ref([]);
    const notifications: Ref<Notification[]> = ref([]);
    const client: Ref<DocSocketClient|null> = ref(null);
    const appStorage: Ref<AppStorage> = ref(new AppStorage());

    function setClient(newClient: DocSocketClient) {
        client.value = newClient;
    }

    return { appStorage, projects, notifications, client, setClient };
})