import { Container } from "pixi.js";
import { Colors, Constants } from "../constants";


export class ActionsPanel {

    readonly root: Container;
    readonly width: number;
    readonly height: number;

    constructor(parent: Container) {
        this.root = new PIXI.Container();
        this.root.position.set(0.2 * Constants.WIDTH, 0.9 * Constants.HEIGHT);
        this.width = 0.6 * Constants.WIDTH;
        this.height = 0.1 * Constants.HEIGHT;

        const rect = new PIXI.Graphics()
            .beginFill(Colors.LIGHT_RED)
            .drawRect(0, 0, this.width, this.height)
            .endFill();

        this.root.addChild(rect);

        parent.addChild(this.root);
    }
}