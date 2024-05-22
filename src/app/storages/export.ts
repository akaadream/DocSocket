import {defineStore} from "pinia";
import {ref} from "vue";
import {TemplateMessage} from "../../utils/TemplateMessage.ts";
import {useGlobalStore} from "./global.ts";

export const useExportStore = defineStore('export', () => {
    const exportCode = ref("");

    function updateExport() {
        const globalStorage = useGlobalStore();
        exportCode.value = ``;
        for (let i = 0; i < globalStorage.appStorage.messages.length; i++) {
            const message: TemplateMessage = globalStorage.appStorage.messages[i];
            if (message) {
                exportCode.value += message.toMarkdown();
            }
        }
    }

    return { exportCode, updateExport };
})