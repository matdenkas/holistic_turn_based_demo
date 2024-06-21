import { Entity, Plan } from "./entity";


export class Player extends Entity {

    readonly movementSpeed: number = 5;
    readonly summonRange: number = 3;

    // For now, the only thing the player can do is move
    // So, the only "plan" they can make is to move to a point
    // In future, this will be a much more complex object
    plan: Plan | null = null;

    constructor() {
        super({});

        const img = new PIXI.Sprite(window.game.texture.girl);
        img.anchor.set(0.5, 0.5);
        img.width = 50;
        img.height = 100;
        this.root.addChild(img);
    }
}