import { Container } from "pixi.js";
import { Colors, Constants } from "../constants";


export class InfoPanel {

    readonly root: Container;
    readonly width: number;
    readonly height: number;

    constructor(parent: Container) {
        this.root = new PIXI.Container();
        this.root.position.set(0, 0);
        this.width = 0.2 * Constants.WIDTH;
        this.height = Constants.HEIGHT;

        const rect = new PIXI.Graphics()
            .beginFill(Colors.LIGHT_CYAN)
            .drawRect(0, 0, this.width, this.height)
            .endFill();

        this.root.addChild(rect);

        parent.addChild(this.root);
    }
}