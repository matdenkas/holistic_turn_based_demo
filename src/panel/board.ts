import { ColorSource, Container, Graphics } from "pixi.js";
import { Colors, Constants } from "../constants";
import { Entity } from "../entity";
import { Util } from "../util";
import { Game, State } from "../game";
import { Pathfinder } from "../pathfinder";
import { Player } from "../player";


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
    public forceNextTurn: Boolean = false;

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
                this.tileContainer.addChild(tile.root);
            }
        }
    }

    startGame(): void {
        PIXI.Ticker.shared.add(this.tick, this);
    }

    public startMoving(): void {
        // Find all tiles that are reachable by the player, and mark them as movable
        const player: Player = this.game.player;
        const movable: Set<Point> = Pathfinder.findAll(player.pos, player.movementSpeed, pos => {
            if (!Util.isIn(pos.x, pos.y, 0, 0, this.tileWidth, this.tileHeight)) {
                return Infinity; // Not in bounds, unable to move
            }
            
            const tile = this.tileAt(pos.x, pos.y);
            if (!tile.properties().isMovable) {
                return Infinity; // Tile is not movable
            }

            return 1; // All tiles cost one movement to walk through (for now)
        });

        // Mark all tiles as movable, which will update their graphics, and flag them as possible move targets
        for (const pos of movable) {
            this.tileAt(pos.x, pos.y).setMovable();
        }
    }

    public stopMoving(): void {
        for (const tile of this.tiles) {
            tile.clearMovable();
        }
    }

    tick(delta: number) {
        this.currentTurnTime += delta;
        if(this.currentTurnTime >= 60 * this.turnSeconds || this.forceNextTurn) {
            this.turnCounter++;

            this.currentTurnTime = 0;
            this.forceNextTurn = false;
            this.updateAll();
        }

        this.game.infoPanel.gameStateBox.updateGameStateUi(this.currentTurnTime, this.turnCounter, this.turnSeconds);
    }

    updateAll(): void {
        // 1. AI select all their plan (preUpdate)
        
        // 2. Sort all entities
        
        // 3. All update (update)

        // For now, just move the player if they have a planned move, then clear their plan
        const player: Player = this.game.player;
        if (player.plan) {
            this.moveEntity(player, player.plan.x, player.plan.y);
            player.plan = null;
        }

        // 4. Animate / Feedback
    }

    onClick(pos: Point): boolean {
        const tilePos = this.untranslatePos(pos.x, pos.y);

        if (Util.isIn(tilePos.x, tilePos.y, 0, 0, this.tileWidth, this.tileHeight)) {
            const tile: Tile = this.tileAt(tilePos.x, tilePos.y);
            
            // Clicked on a tile, so figure out what we need to do based on the game state
            switch (this.game.state) {
                case State.NORMAL:
                    // Log a message for fun
                    this.game.logPanel.post(`${tile.properties().name} Tile ${tile.x}, ${tile.y}`);
                    return true;
                
                case State.MOVING:
                    // If moving, and the tile is movable, we confirm movement
                    // Then, we need to clear all movable flags
                    if (tile.isMovable()) {
                        this.stopMoving();
                        this.game.confirmMoving(tilePos);
                        return true;
                    }
                    break;
            }
        }
        return false;
    }

    onHover(pos: Point): IHoverCallback | null {
        const tilePos = this.untranslatePos(pos.x, pos.y);

        if (Util.isIn(tilePos.x, tilePos.y, 0, 0, this.tileWidth, this.tileHeight)) {
            // Hovering on a tile, so highlight it
            const tile: Tile = this.tileAt(tilePos.x, tilePos.y);
            const properties: TileProperties = tile.properties();
            
            // Update info box
            this.game.infoPanel.infoBox.updateInfoColorPosHeaderBody(
                properties.color, 
                new PIXI.Point(tile.x, tile.y), 
                properties.name, 
                properties.desc
            );

            // Return a callback that can both hover, and un-hover the targeted tile
            return {
                onStartHover() { tile.startHover(); },
                onEndHover() { tile.endHover(); }
            };
        }

        return null;
    }
 
    public addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.entityContainer.addChild(entity.root);
    }

    public moveEntity(entity: Entity, x: number, y: number): void {
        const pos = this.translatePos(x, y);
        
        entity.pos = { x, y };
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

interface TileProperties {
    readonly name: string;
    readonly desc: string;
    readonly color: ColorSource;
    readonly isMovable: boolean;
}


class Tile {

    static readonly SIZE: number = 42;

    private static readonly PROPERTIES: TileProperties[] = (() => {
        function of(name: string, desc: string, color: ColorSource, properties: Partial<TileProperties> = {}): TileProperties {
            return Object.assign({ isMovable: true }, { name, desc, color, ...properties });
        }
    
        return [
            of('Sand', 'Its so sandy! Yuck! I hate sand, its corse rough and gets everywhere!', 0xb8a254),
            of('Grass', 'Such nice soft grass!', 0x49822f),
            of('Water', 'Remember slimes are allergic to water!', 0x6093d1, { isMovable: false }),
            of('Rock', 'Rock solid :3', 0x615029, { isMovable: false }),
        ];
    })();

    readonly root: Container;
    readonly width: number = Tile.SIZE;
    readonly height: number = Tile.SIZE;
    readonly id: TileId;
    readonly x: number;
    readonly y: number;

    hover: Graphics | null = null;
    move: Graphics | null = null;

    constructor(id: TileId, x: number, y: number) {
        this.root = new PIXI.Container();
        this.id = id;
        this.x = x;
        this.y = y;

        this.root.addChild(new PIXI.Graphics()
            .beginFill(this.properties().color)
            .drawRect(-Tile.SIZE / 2 - 1, -Tile.SIZE / 2 - 1, Tile.SIZE - 2, Tile.SIZE - 2)
            .endFill());
    }

    public properties(): TileProperties {
        return Tile.PROPERTIES[this.id];
    }

    startHover(): void {
        this.endHover();
        this.root.addChild(this.hover = new PIXI.Graphics()
            .beginFill(0xffffff, 0.3)
            .drawRect(-Tile.SIZE / 2 - 1, -Tile.SIZE / 2 - 1, Tile.SIZE - 2, Tile.SIZE - 2)
            .endFill());
    }

    endHover(): void {
        this.hover?.removeFromParent();
        this.hover = null;
    }

    setMovable(): void {
        this.clearMovable();
        this.root.addChild(this.move = new PIXI.Graphics()
            .beginFill(0x35de62)
            .drawCircle(0, 0, 0.3 * Tile.SIZE)
            .endFill());
    }

    clearMovable(): void {
        this.move?.removeFromParent();
        this.move = null;
    }

    isMovable(): boolean {
        return this.move != null;
    }
}