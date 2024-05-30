import { Client, ClientArray, Room } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "./schema/Player";

export class TestRoom extends Room<MyRoomState> {
    maxClients: number = 4; 

    onCreate(options: any): void | Promise<any> {
        this.setState(new MyRoomState());

        this.onMessage("ping", (client, message) => {
            client.send("pong", {
                "client": client,
                "message": message
            });
        });
    }

    onJoin(client: Client<this["clients"] extends ClientArray<infer U, any> ? U : never, this["clients"] extends ClientArray<infer _, infer U> ? U : never>, options?: any, auth?: this["clients"] extends ClientArray<infer _, infer U> ? U : never): void | Promise<any> {
        const player = new Player();
        player.x = Math.round(Math.random() * 100);
        player.y = Math.round(Math.random() * 100);
        player.username = options.username;

        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: Client<this["clients"] extends ClientArray<infer U, any> ? U : never, this["clients"] extends ClientArray<infer _, infer U> ? U : never>, consented?: boolean): void | Promise<any> {
        this.state.players.delete(client.sessionId);
    }

    onDispose(): void | Promise<any> {
        
    }
}