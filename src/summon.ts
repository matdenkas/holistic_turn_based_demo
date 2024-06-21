import { Entity } from "./entity";
import type { Texture } from "pixi.js";

export interface SummonType {
    readonly displayText: string;
    readonly summonTurns: number;
    
    readonly summon: () => Entity;
}


export class Summon extends Entity {

    public static load(): SummonType[] {
        function of(displayText: string, summonTurns: number, summon: () => Entity): SummonType {
            return { displayText, summonTurns, summon } as const;
        }

        return [
            of('Slime', 3, () => new Summon(window.game.texture.slime))
        ];
    }
    
    readonly movementSpeed: number = 10;

    constructor(texture: Texture) {
        super({});

        this.root.addChild(new PIXI.Sprite(texture));
    }
}