import type { Application, ColorSource, Container, Graphics, Texture } from "pixi.js";
import { Colors, Constants } from "./constants";
import { Log } from "./log";
import { Board } from "./board";
import { Util } from "./util";


function backgroundRect(color: ColorSource, w: number, h: number): Graphics {
    return new PIXI.Graphics()
        .beginFill(color)
        .drawRect(0, 0, w, h)
        .endFill();
}


export class Game {
    readonly app: Application;
    readonly stage: Container;
    readonly texture: Texture;

    readonly infoPanel: Container;
    readonly actionPanel: Container;
    readonly boardPanel: Board;
    readonly logPanel: Log;

    constructor(app: Application, texture: Texture) {
        window.game = this;

        this.app = app;
        this.stage = app.stage;
        this.stage.eventMode = 'static';
        this.texture = texture;

        this.infoPanel = new PIXI.Container();
        this.actionPanel = new PIXI.Container();
        this.boardPanel = new Board(this);
        this.logPanel = new Log(this.stage);

        this.infoPanel.position.set(Constants.INFO_X, Constants.INFO_Y);
        this.actionPanel.position.set(Constants.ACTION_X, Constants.ACTION_Y);

        this.infoPanel.addChild(backgroundRect(Colors.LIGHT_CYAN, Constants.INFO_W, Constants.INFO_H));
        this.actionPanel.addChild(backgroundRect(Colors.LIGHT_RED, Constants.ACTION_W, Constants.ACTION_H));

        this.stage.addChild(
            this.infoPanel,
            this.actionPanel,
        );

        this.stage.on('pointertap', event => this.onPointerTap(event));


        const TILES = [
            '00000000000000000000',
            '00033300000003000000',
            '00333300000033300000',
            '00330000000003000000',
            '00000000000000000000',
            '00333000022200000000',
            '03330000022220000000',
            '00000002222220000000',
            '00000222222220000000',
            '00022222222200001111',
            '00000222222000000111',
            '00000000000000011111',
            '00000000000000111101',
            '00330000000111110000',
            '03333000001111010000',
            '03330000000110100000',
            '00000000011111000000',
            '00000000111000003300',
            '00000001111100033300',
            '00000011110000000000'
        ]

        this.boardPanel.build({ width: 20, height: 20, tiles: TILES });
        this.logPanel.post('A wild creeper appeared!');
    }

    onPointerTap(event: PointerEvent): void {
        console.log(`Tapped at ${event.screenX}, ${event.screenY}`);

        if (Util.isInPanel(event, this.boardPanel)) {
            this.boardPanel.onPointerTap(event);
        }
    }
}