import type { Container, Graphics, Point } from "pixi.js";
import { Colors, Constants } from "../constants";
import { Creeper, Entity } from "../entity";
import { Util } from "../util";
import { Game } from "../game";


interface BoardInfo {
    width: number,
    height: number,
    tiles: string[] // Placeholder
}


/**
 * The panel where all the action happens - the map, entities, and interactions.
 * Typical combat involves selecting an entity, selecting its actions, and then
 * watching the result
 */
export class Board {

    readonly game: Game;
    readonly root: Container;
    readonly width: number;
    readonly height: number;

    // Layers for drawing, bottom-to-top
    private readonly tileContainer: Container;
    private readonly entityContainer: Container;

    private readonly entities: Entity[];
    private tiles: Tile[];
    private tileWidth: number;
    private tileHeight: number;

    // Game state
    private turnCounter: number = 0;
    private turnSeconds: number = 10;
    private currentTurnTime: number = 0;
    private forceNextFrame: Boolean = false;

    constructor(game: Game) {
        this.game = game;
        this.root = new PIXI.Container();
        this.root.position.set(0.2 * Constants.WIDTH, 0);
        this.width = 0.6 * Constants.WIDTH;
        this.height = 0.9 * Constants.HEIGHT;
        this.tileContainer = new PIXI.Container();
        this.entityContainer = new PIXI.Container();
        this.entities = [];

        const rect = new PIXI.Graphics()
            .beginFill(Colors.DARK_GRAY)
            .drawRect(0, 0, this.width, this.height)
            .endFill();

        this.root.addChild(
            rect,
            this.tileContainer,
            this.entityContainer
        );

        this.tiles = [];
        this.tileWidth = 0;
        this.tileHeight = 0;

        game.stage.addChild(this.root);
        this.startGame();
    }


    build(info: BoardInfo): void {
        // Size in board coordinates
        this.tileWidth = info.width;
        this.tileHeight = info.height;

        // Build the tile grid and add them to the stage
        this.tiles = [];
        for (let x = 0; x < this.tileWidth; x++) {
            for (let y = 0; y < this.tileHeight; y++) {
                const tileId: TileId = parseInt(info.tiles[y][x]);
                const tile: Tile = new Tile(tileId, x, y);
                const pos = this.translatePos(x, y); 

                tile.root.position.set(pos.x, pos.y);
                this.tiles.push(tile);
                this.entityContainer.addChild(tile.root);
            }
        }

        const creeper = new Creeper();

        this.addEntity(creeper);
        this.moveEntity(creeper, 4, 3);
    }

    startGame(): void {
        PIXI.Ticker.shared.add(this.tick, this);
    }

    tick(delta: number) {
        this.currentTurnTime += delta;
        if(this.currentTurnTime >= 60 * this.turnSeconds || this.forceNextFrame) {
            this.turnCounter++;
            
            this.currentTurnTime = 0;
            this.forceNextFrame = false;
            this.updateAll();
        }

        this.game.infoPanel.gameStateBox.updateGameStateUi(this.currentTurnTime, this.turnCounter, this.turnSeconds);
    }

    updateAll(): void {

        


        // 1. AI select all their plan (preUpdate)
        // 2. Sort all entities
        // 3. All update (update)
        // 4. Animate / Feedback
    }

    onClick(pos: Point): boolean {
        const tilePos = this.untranslatePos(pos.x, pos.y);

        if (Util.isIn(tilePos.x, tilePos.y, 0, 0, this.tileWidth, this.tileHeight)) {
            // Clicked on a tile, for now just log a message
            const tile: Tile = this.tileAt(tilePos.x, tilePos.y);
            this.game.logPanel.post(`${['Sand', 'Grass', 'Water', 'Rock'][tile.id]} Tile ${tile.x}, ${tile.y}`);
            return true;
        }
        return false;
    }

    onHover(pos: Point): IHoverCallback | null {
        const tilePos = this.untranslatePos(pos.x, pos.y);

        if (Util.isIn(tilePos.x, tilePos.y, 0, 0, this.tileWidth, this.tileHeight)) {
            // Hovering on a tile, so highlight it
            const tile: Tile = this.tileAt(tilePos.x, tilePos.y);
            
            // Update info box
            this.game.infoPanel.infoBox.updateInfoColorPosHeaderBody(
                TILE_COLORS[tile.id], 
                new PIXI.Point(tile.x, tile.y), 
                ['Sand', 'Grass', 'Water', 'Rock'][tile.id], 
                ['Its so sandy! Yuck! I hate sand, its corse rough and gets everywhere!', 'Such nice soft grass!', 'Remember slimes are allergic to water!', 'Rock solid :3'][tile.id]
            );

            // Return a callback that can both hover, and un-hover the targeted tile
            return {
                onStartHover() { tile.startHover(); },
                onEndHover() { tile.endHover(); }
            };
        }

        return null;
    }
 
    private addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.entityContainer.addChild(entity.root);
    }

    private moveEntity(entity: Entity, x: number, y: number): void {
        const pos = this.translatePos(x, y);
        entity.root.position.set(pos.x, pos. y);
    }

    /** Returns the tile at the given board coordinates (rounded down) */
    private tileAt(x: number, y: number): Tile {
        return this.tiles[this.tileHeight * Math.floor(x) + Math.floor(y)]!;
    }
    
    /**
     * Given board coordinates, translate them to screen coordinates to position an entity at
     */
    private translatePos(x: number, y: number): { x: number, y: number } {

        // Calculate the desired position to keep the board centered on the view that we have
        const marginLeft: number = (this.width - this.tileWidth * Tile.SIZE) / 2;
        const marginTop: number = (this.height - this.tileHeight * Tile.SIZE) / 2;

        // Board is indexed top left origin as per usual, but tiles are referenced from the center,
        // not the top left, so it is easier to position entities (also referenced from the center),
        // which may not be the same size as a tile
        return {
            x: marginLeft + x * Tile.SIZE + Tile.SIZE / 2,
            y: marginTop + y * Tile.SIZE + Tile.SIZE / 2,
        };
    }

    /**
     * Given screen coordinates, translate them to board coordinates (possibly fractional)
     */
    private untranslatePos(x: number, y: number): { x: number, y: number } {
        const marginLeft: number = (this.width - this.tileWidth * Tile.SIZE) / 2;
        const marginTop: number = (this.height - this.tileHeight * Tile.SIZE) / 2;

        return {
            x: (x - marginLeft) / Tile.SIZE,
            y: (y - marginTop) / Tile.SIZE,
        }
    }
}

const enum TileId {
    SAND,
    GRASS,
    WATER,
    ROCK
}

const TILE_COLORS: number[] = [ 0xb8a254, 0x49822f, 0x6093d1, 0x615029 ];


class Tile {

    static readonly SIZE: number = 42;

    readonly root: Container;
    readonly width: number = Tile.SIZE;
    readonly height: number = Tile.SIZE;
    readonly id: TileId;
    readonly x: number;
    readonly y: number;

    hover: Graphics | null = null;

    constructor(id: TileId, x: number, y: number) {
        this.root = new PIXI.Container();
        this.id = id;
        this.x = x;
        this.y = y;

        this.root.addChild(new PIXI.Graphics()
            .beginFill(TILE_COLORS[id])
            .drawRect(-Tile.SIZE / 2 - 1, -Tile.SIZE / 2 - 1, Tile.SIZE - 2, Tile.SIZE - 2)
            .endFill());
    }

    startHover(): void {
        this.root.addChild(this.hover = new PIXI.Graphics()
            .beginFill(0xffffff, 0.3)
            .drawRect(-Tile.SIZE / 2 - 1, -Tile.SIZE / 2 - 1, Tile.SIZE - 2, Tile.SIZE - 2)
            .endFill());
    }

    endHover(): void {
        this.hover?.removeFromParent();
        this.hover = null;
    }
}