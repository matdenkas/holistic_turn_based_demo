import type { Container, Graphics } from "pixi.js";
import { Colors, Constants } from "../constants";
import { Util } from "../util";
import { Game } from "../game";


interface Action {
    readonly text: string
    readonly callback: () => void
}

interface ActionPanel extends Panel {
    readonly action: Action
    hover: Graphics;
}


export class ActionsPanel {

    readonly game: Game;
    readonly root: Container;
    readonly width: number;
    readonly height: number;

    private readonly buttonsRoot: Container = new PIXI.Container();

    // The currently available actions, which is displayed as a series of buttons on the bottom of the screen
    // 
    private actions: ActionPanel[] = [];

    constructor(game: Game) {
        this.game = game;
        this.root = new PIXI.Container();
        this.root.position.set(0.2 * Constants.WIDTH, 0.9 * Constants.HEIGHT);
        this.width = 0.6 * Constants.WIDTH;
        this.height = 0.1 * Constants.HEIGHT;

        const rect = new PIXI.Graphics()
            .beginFill(Colors.LIGHT_RED)
            .drawRect(0, 0, this.width, this.height)
            .endFill();

        this.root.addChild(
            rect,
            this.buttonsRoot
        );
        this.updateActions(); // Initialize default actions
        game.stage.addChild(this.root);
    }

    public onClick(pos: Point): boolean {
        for (const action of this.actions) {
            if (Util.isInPanel(pos, action)) {
                action.action.callback();
                return true;
            }
        }
        return false;
    }

    public onHover(pos: Point): IHoverCallback | null {
        for (const action of this.actions) {
            if (Util.isInPanel(pos, action)) {
                return {
                    onStartHover: () => this.startHover(action),
                    onEndHover: () => this.endHover(action),
                };
            }
        }
        return null;
    }

    private startHover(action: ActionPanel): void {
        action.root.addChild(action.hover);
    }

    private endHover(action: ActionPanel): void {
        action.hover?.removeFromParent();
    }

    public updateActions(newActions: Action[] | null = null): void {
        // Update the buttons on the bottom of the screen
        if (newActions === null) {
            // Default actions
            newActions = [{
                text: 'Move',
                callback: () => this.game.startMoving()
            }];
        }

        // Remove all previous children
        for (const prevAction of this.actions) {
            prevAction.root.removeFromParent();
        }

        const BTN_PADDING = 0.15 * this.height;
        const BTN_SIZE = this.height - 2 * BTN_PADDING;

        let btnX = BTN_PADDING;
        let btnY = BTN_PADDING;

        this.actions = newActions.map(action => {
            const root: Container = new PIXI.Container();
            const height: number = BTN_SIZE;
            const width: number = BTN_SIZE;

            root.position.set(btnX, btnY);

            const rect = new PIXI.Graphics()
                .lineStyle(3)
                .beginFill(Colors.LIGHT_BLUE_WHITE)
                .drawRoundedRect(0, 0, width, height, 15)
                .endFill();
            const hover = new PIXI.Graphics()
                .beginFill(0xffffff, 0.3)
                .drawRoundedRect(0, 0, BTN_SIZE, BTN_SIZE, 15)
                .endFill();

            const text = new PIXI.Text(action.text, {
                fontFamily: 'Arial',
                fontWeight: 'normal',
                fill: 'black'
            });

            text.width = width - 4;
            text.scale.set(text.scale.x);
            text.position.set(2, 2 + (height - text.height) / 2);

            root.addChild(
                rect,
                text
            );
            this.buttonsRoot.addChild(root);

            btnX += BTN_SIZE + BTN_PADDING;

            return { root, width, height, action, hover };
        });
    }
}