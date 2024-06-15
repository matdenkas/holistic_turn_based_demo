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

    pos: Point;
    
    constructor(properties: Partial<EntityProperties>) {
        this.root = new PIXI.Container();
        this.properties = properties;
        this.pos = { x: 0, y: 0 };
    }

    update(): void {}
}

/**
 * I'm imagining this dictates a lot of simple properties that entities might have
 */
interface EntityProperties {
    // todo: imagine what properties would go here
}