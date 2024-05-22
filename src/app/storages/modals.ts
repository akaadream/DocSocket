import {defineStore} from "pinia";
import {ref} from "vue";

export const useModalsStore = defineStore('modals', () => {
    const opened = ref("");
    function open(name: string) {
        opened.value = name;
    }

    function modalOpened(name: string): boolean {
        return opened.value === name;
    }

    function closeModal() {
        opened.value = "";
    }

    return { opened, open, modalOpened, closeModal };
})