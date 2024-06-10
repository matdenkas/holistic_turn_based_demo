export module Util {
    /** Returns true if the position (x, y) is within the square bounded by [x0, x0 + width), [y0, y0 + height) */
    export function isIn(x: number, y: number, x0: number, y0: number, width: number, height: number): boolean {
        return x >= x0 && y >= y0 && x < x0 + width && y < y0 + height;
    }

    export function isInPanel(pos: Point, panel: Panel): boolean {
        return isIn(pos.x, pos.y, panel.root.x, panel.root.y, panel.width, panel.height)
    }

    export function relativeTo(pos: Point, panel: Panel): Point {
        return { x: pos.x - panel.root.x, y: pos.y - panel.root.y };
    }
}
