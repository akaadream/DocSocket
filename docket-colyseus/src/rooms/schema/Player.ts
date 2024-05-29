import { Schema, type } from '@colyseus/schema';

export class Player extends Schema {
    @type('string') username: string;
    @type('number') x: number;
    @type('number') y: number;
}