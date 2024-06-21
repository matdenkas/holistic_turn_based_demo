/**
 * The global constant PIXI available in production, via direct `<script>` tag.
 */
declare const PIXI: typeof import('pixi.js');


interface Panel {
    readonly root: Container;
    readonly width: number;
    readonly height: number;
}

interface Point {
    readonly x: number;
    readonly y: number;
}

interface Textures<T> {
    girl: T,
    fox: T,
    slime: T,
}

/**
 * An element that can be hovered on. The game will hold the element that was most recently hovered and handle calling
 * `onEndHover()` when the mouse is moved away from the hovered element.
 */
interface IHoverCallback {
    onStartHover(): void;
    onEndHover(): void;
}