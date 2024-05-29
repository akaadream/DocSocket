import { Schema, MapSchema, Context, type } from "@colyseus/schema";
import { Player } from "./Player";

export class MyRoomState extends Schema {

  @type('number') round = 0;
  @type({ map: Player }) players = new MapSchema<Player>();

}
