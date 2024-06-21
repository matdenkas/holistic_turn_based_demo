import { Entity } from "./entity";
import type { Texture } from "pixi.js";


export class Summon extends Entity {
    
    plan: Point | null = null;
    readonly displayText: string;
    readonly movementSpeed: number = 10;
    readonly baseSummonTime: number;

    constructor(displayText: string, baseSummonTime: number, texture: Texture) {
        super({});

        this.displayText = displayText;

        this.baseSummonTime = baseSummonTime;
        this.root.addChild(new PIXI.Sprite(texture));
    }


    public static load_Summons(): Summon[] {
        

        const summons = []
        summons.push(new Summon('Slime', 3, window.game.texture.slime));





        return summons
    }
}