import { Game } from "./game";

declare global {
    interface Window {
        game: Game;
    }

    const DEBUG: true;
}

async function main() {
    
    // Loading ...
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
    PIXI.settings.RESOLUTION = window.devicePixelRatio;

    const app = new PIXI.Application();

    app.init({
        background: 0x00ffff,
        width: 1000,
        height: 500,
        view: document.getElementById('screen') as HTMLCanvasElement
    });
    window.game = new Game(app);
}

window.onload = () => main();