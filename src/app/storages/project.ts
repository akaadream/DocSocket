import {defineStore} from "pinia";
import {DocSocketClient} from "../../clients/DocSocketClient.ts";
import {ref, Ref} from "vue";
import {TemplateMessage} from "../../utils/TemplateMessage.ts";
import {Message} from "../../utils/Message.ts";
import {ColyseusClient} from "../../clients/ColyseusClient.ts";
import {SocketIOClient} from "../../clients/SocketIOClient.ts";
import {WebSocketClient} from "../../clients/WebSocketClient.ts";

export const useProjectStore = defineStore('project', () => {
    const client: Ref<DocSocketClient|null> = ref(null);
    const templates: Ref<TemplateMessage[]> = ref([]);
    const messages: Ref<Message[]> = ref([]);

    function connect(service: string, address: string, roomName: string, username: string) {
        switch (service) {
            case 'colyseus':
                client.value = new ColyseusClient(address, roomName, username);
                break;
            case 'socketio':
                client.value = new SocketIOClient(address, username);
                break;
            case 'websocket':
                client.value = new WebSocketClient(address, username);
                break;
        }
    }

    return {
        client,
        messages,
        templates,

        connect,
    }
});