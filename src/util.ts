import type { Container } from "pixi.js";

export module Util {
    /** Returns true if the position (x, y) is within the square bounded by [x0, x0 + width), [y0, y0 + height) */
    export function isIn(x: number, y: number, x0: number, y0: number, width: number, height: number): boolean {
        return x >= x0 && y >= y0 && x < x0 + width && y < y0 + height;
    }

    type MousePoint = Readonly<{ screenX: number, screenY: number }>;
    type Panel = Readonly<{ root: Container, width: number, height: number }>;

    export function isInPanel(pos: MousePoint, panel: Panel): boolean {
        return isIn(pos.screenX, pos.screenY, panel.root.x, panel.root.y, panel.width, panel.height)
    }

    export function relativeTo(pos: MousePoint, panel: Panel): MousePoint {
        return { screenX: pos.screenX - panel.root.x, screenY: pos.screenY - panel.root.y };
    }
}
