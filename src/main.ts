import { Colors, Constants } from "./constants";
import { Game } from "./game";

declare global {
    interface Window {
        game: Game;
    }

    const DEBUG: true;
}

async function main() {
    
    // Loading ...

    const app = new PIXI.Application({
        antialias: false,
        powerPreference: 'high-performance',
        resolution: window.devicePixelRatio,
        background: Colors.BLACK,
        width: Constants.WIDTH,
        height: Constants.HEIGHT,
    });
    document.body.appendChild(app.view as any);
    window.game = new Game(app);
}

window.onload = () => main();