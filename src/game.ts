import type { Application, Container } from "pixi.js";


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

        this.stage.addChild(
            this.infoPanel,
            this.actionPanel,
            this.boardPanel,
            this.logPanel
        );

        const obj = new PIXI.Graphics();
        obj.beginFill(0xff0000);
        obj.drawCircle(50, 50, 20);
        this.infoPanel.addChild(obj);
    }
}