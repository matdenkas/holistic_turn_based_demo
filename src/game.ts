import type { Application, ColorSource, Container, Graphics } from "pixi.js";
import { Colors, Constants } from "./constants";


function backgroundRect(color: ColorSource, w: number, h: number): Graphics {
    return new PIXI.Graphics()
        .beginFill(color)
        .drawRect(0, 0, w, h)
        .endFill();
}


export class Game {
    readonly app: Application;
    readonly stage: Container;

    readonly infoPanel: Container;
    readonly actionPanel: Container;
    readonly boardPanel: Container;
    readonly logPanel: Container;

    constructor(app: Application) {
        this.app = app;
        this.stage = app.stage;
        this.stage.eventMode = 'static';

        this.infoPanel = new PIXI.Container();
        this.actionPanel = new PIXI.Container();
        this.boardPanel = new PIXI.Container();
        this.logPanel = new PIXI.Container();

        this.infoPanel.position.set(Constants.INFO_X, Constants.INFO_Y);
        this.actionPanel.position.set(Constants.ACTION_X, Constants.ACTION_Y);
        this.boardPanel.position.set(Constants.BOARD_X, Constants.BOARD_Y);
        this.logPanel.position.set(Constants.LOG_X, Constants.LOG_Y);

        this.infoPanel.addChild(backgroundRect(Colors.LIGHT_CYAN, Constants.INFO_W, Constants.INFO_H));
        this.actionPanel.addChild(backgroundRect(Colors.LIGHT_RED, Constants.ACTION_W, Constants.ACTION_H));
        this.boardPanel.addChild(backgroundRect(Colors.LIGHT_BLUE, Constants.BOARD_W, Constants.BOARD_H));
        this.logPanel.addChild(backgroundRect(Colors.LIGHT_PINK, Constants.LOG_W, Constants.LOG_H));

        this.stage.addChild(
            this.infoPanel,
            this.actionPanel,
            this.boardPanel,
            this.logPanel
        );

        this.stage.on('pointertap', event => this.onPointerTap(event));
    }

    onPointerTap(event: PointerEvent): void {
        console.log(`Tapped at ${event.screenX}, ${event.screenY}`);
    }
}