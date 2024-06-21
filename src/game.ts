import type { Application, Container, Texture } from "pixi.js";
import { Log } from "./panel/log";
import { Board } from "./panel/board";
import { Util } from "./util";
import { InfoPanel } from "./panel/info";
import { ActionsPanel } from "./panel/actions";
import { Player } from "./player";
import { Summon, SummonType } from "./summon";


/**
 * The current state of the game, from a player UI perspective
 * UI elements may check the state to know what to interact with
 */
export const enum State {
    // Normal game play, where you can select actions, tiles, etc.
    NORMAL,
    // Moving the player character
    // - Tiles are displayed movable or not
    // - Tiles can be selected to "confirm" the movement
    MOVING,
    // The state where animations are playing after a turn ends,
    // and all actions are computed. Nothing can be interacted with
    // in this state
    PLAYING,
    // Starting a summon. The player must then select a further action
    // which selects which summon to complete
    SUMMON_CHOICE,
    // A summon entity has been selected, and the player must then select
    // a position to summon the entity at
    SUMMONING_POSITION,
}


export class Game {
    readonly app: Application;
    readonly stage: Container;
    readonly texture: Textures<Texture>;

    readonly infoPanel: InfoPanel;
    readonly actionPanel: ActionsPanel;
    readonly boardPanel: Board;
    readonly logPanel: Log;

    readonly player: Player;

    state: State = State.NORMAL;

    private lastHover: IHoverCallback | null = null;
    private currentSummon: SummonType | null = null;
    
    private summons: SummonType[] = Summon.load();

    constructor(app: Application, texture: Textures<Texture>) {
        window.game = this;

        this.app = app;
        this.stage = app.stage;
        this.stage.eventMode = 'static';
        this.texture = texture;

        this.infoPanel = new InfoPanel(this.stage);
        this.actionPanel = new ActionsPanel(this);
        this.boardPanel = new Board(this);
        this.logPanel = new Log(this.stage);

        this.stage.on('pointertap', event => this.onClick(event));
        this.stage.on('pointermove', event => this.onHover(event));


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

        this.player = new Player();
        this.boardPanel.addEntity(this.player);
        this.boardPanel.moveEntity(this.player, 8, 18);
       
    }


    public startMoving(): void {
        Util.assert(this.state === State.NORMAL);

        this.actionPanel.updateActions([{ text: 'Cancel', callback: () => this.cancelMoving() }]);
        this.boardPanel.startMoving();
        this.state = State.MOVING;
    }

    public confirmMoving(pos: Point): void {
        Util.assert(this.state === State.MOVING);

        this.player.plan = {type: 'move', pos};
        this.cancelMoving();
    }

    private cancelMoving(): void {
        Util.assert(this.state === State.MOVING);

        this.boardPanel.clearAllMarkedTiles();
        this.actionPanel.updateActions();
        this.state = State.NORMAL;
    }


    public startSummon(): void {
        Util.assert(this.state === State.NORMAL);
        this.logPanel.post('Summon start');
        
        this.actionPanel.updateActions(
            this.summons.map(summon => ({
                text: summon.displayText,
                callback: () => this.summonPositionPick(summon)
            }))
        );

        this.state = State.SUMMON_CHOICE;
    }
    
    public summonPositionPick(summon: SummonType): void {
        Util.assert(this.state === State.SUMMON_CHOICE);

        this.boardPanel.startSummoning();
        this.currentSummon = summon;
        this.state = State.SUMMONING_POSITION;
    }

    public confirmSummon(pos: Point){
        Util.assert(this.state === State.SUMMONING_POSITION);
        Util.assertNotNull(this.currentSummon);

        const summon = this.currentSummon;

        this.actionPanel.updateActions(); // refresh actions
        this.player.plan = { type: 'summon', summon, pos, remainingTurns: summon.summonTurns };
        this.state = State.NORMAL;
    }


    private onClick(event: PointerEvent): boolean {
        const pos: Point = { x: event.screenX, y: event.screenY } as const;
        
        return Util.tryClick(this.boardPanel, pos)
            || Util.tryClick(this.actionPanel, pos)
            || Util.tryClick(this.infoPanel, pos);
            // can chain additional things here with ||, i.e. short circuiting
    }


    private onHover(event: PointerEvent): boolean {
        const pos: Point = { x: event.screenX, y: event.screenY } as const;
        
        return this.tryHover(this.boardPanel, pos)
            || this.tryHover(this.actionPanel, pos);
            // can chain additional things here with ||, i.e. short circuiting
    }

    private tryHover(panel: Panel & { onHover(pos: Point): IHoverCallback | null }, pos: Point): boolean {
        let hover: IHoverCallback | null;
        if (Util.isInPanel(pos, panel) && (hover = panel.onHover(Util.relativeTo(pos, panel))) !== this.lastHover) {
            // Note that either of `lastHover` or `hover` may be null here
            // We simply end the previous hover (if present), switch to the new value (may be null) and then restart the hover (if present)
            this.lastHover?.onEndHover();
            this.lastHover = hover;
            this.lastHover?.onStartHover();
            return true;
        }
        return false;
    }
}