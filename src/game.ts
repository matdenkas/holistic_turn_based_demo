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

        const WIDTH: number = 1000;
        const HEIGHT: number = 500;

        this.infoPanel.position.set(0, 0);
        this.actionPanel.position.set(200, 400);
        this.boardPanel.position.set(200, 0);
        this.logPanel.position.set(700, 0);

        this.infoPanel.addChild(new PIXI.Graphics().rect(0, 0, 200, 500).fill({ color: 0xff0000 }));
        this.actionPanel.addChild(new PIXI.Graphics().rect(0, 0, 500, 100).fill({ color: 0x00ff00 }));
        this.boardPanel.addChild(new PIXI.Graphics().rect(0, 0, 500, 400).fill({ color: 0x0000ff }));
        this.logPanel.addChild(new PIXI.Graphics().rect(0, 0, 300, 500)).fill({ color: 0x00ffff });

        this.stage.addChild(
            this.infoPanel,
            this.actionPanel,
            this.boardPanel,
            this.logPanel
        );

        const obj = new PIXI.Graphics();
        obj
            .circle(50, 50, 20)
            .fill({ color: 0xff00ff, alpha: 1.0 });
        this.infoPanel.addChild(obj);
    }
}