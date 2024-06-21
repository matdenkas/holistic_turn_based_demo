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
    // todo: eventually we will want a lot more assets, and asset packing, etc.
    // For now, I'm just using a single example texture for testing
    const textures = {
        girl: await PIXI.Assets.load('./assets/GirlGirl.png'),
        fox: await PIXI.Assets.load('./assets/FoxGirl.png'),
        slime: await PIXI.Assets.load('./assets/SlimeGirl.png'),
    }



    const app = new PIXI.Application({
        antialias: false,
        powerPreference: 'high-performance',
        resolution: window.devicePixelRatio,
        background: Colors.BLACK,
        width: Constants.WIDTH,
        height: Constants.HEIGHT,
    });
    document.body.appendChild(app.view as any);
    new Game(app, textures);
}

window.onload = () => main();