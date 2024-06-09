import type { Container } from "pixi.js";


/**
 * An entity is anything that exists on the "board" of the game. It includes the player character,
 * allied and enemy creatures, projectiles, and objects on the map. It may participate in the any of
 * the phases during combat:
 * 
 * 1) Player Actions (controllable entities can be selected, and actions "planned"). Ended by explicit
 *    button press
 * 2) AI Actions (automatic, controllable enemies select their planned actions)
 * 3) Update Loop (all entities are sorted, and resolve their planned actions, handling conflicts between
 *    their planned action and what was actually possible). This posts actions taken in order to the log.
 * 4) Results (all actions are taken, showing animation / visuals)
 *    N.B. For now, this is a no-op
 */
export class Entity {

    readonly root: Container;
    readonly properties: EntityProperties;
    
    constructor(properties: Partial<EntityProperties>) {
        this.root = new PIXI.Container();
        this.properties = {
            canControl: properties.canControl ?? false,
            canTarget: properties.canTarget ?? false,
        };
    }

    update(): void {}
}

/**
 * I'm imagining this dictates a lot of simple properties that entities might have
 */
interface EntityProperties {
    /**
     * If `true`, this entity is controllable and can be interacted with
     */
    readonly canControl: boolean;

    /**
     * If `true`, this entity can be targeted as part of an action that requires
     * a target (for instance an attack).
     */
    readonly canTarget: boolean;
}

export class Creeper extends Entity {
    constructor() {
        super({});

        const img = new PIXI.Sprite(window.game.texture);
        img.anchor.set(0.5, 0.5);
        img.width = 50;
        img.height = 100;
        this.root.addChild(img);
    }
}