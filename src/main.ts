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
        background: 0xffffff,
        width: 800,
        height: 800,
        view: document.getElementById('screen') as HTMLCanvasElement
    });

    window.game = new Game(app);
}

window.onload = () => main();