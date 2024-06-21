import { Entity } from "./entity";


export class Player extends Entity {

    readonly movementSpeed: number = 5;
    readonly summonRange: number = 3;

    constructor() {
        super({});

        const img = new PIXI.Sprite(window.game.texture.girl);
        img.anchor.set(0.5, 0.5);
        img.width = 50;
        img.height = 100;
        this.root.addChild(img);
    }
}