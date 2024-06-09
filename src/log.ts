import type { Container, Text } from "pixi.js";
import { Colors, Constants } from "./constants";


const PADDING: number = 10;
const PADDING_HALF: number = 5;


/**
 * The panel to the right hand side of the screen, which records actions taken. 
 */
export class Log {

    private readonly messages: ({ text: string, obj: Text })[];
    private messageHeight: number; // Total height of all messages (including padding)

    private readonly root: Container;
    private readonly width: number;
    private readonly height: number;

    constructor(parent: Container) {
        this.messages = [];
        this.root = new PIXI.Container();
        this.root.position.set(0.8 * Constants.WIDTH, 0);
        this.width = 0.2 * Constants.WIDTH;
        this.height = Constants.HEIGHT;
        this.messageHeight = 0;

        const rect = new PIXI.Graphics()
            .beginFill(Colors.LIGHT_PINK)
            .drawRect(0, 0, this.width, this.height)
            .endFill();

        this.root.addChild(rect);
        parent.addChild(this.root);
    }

    /**
     * Post a message to the log panel. Displays in order of posting, bottom to top, oldest messages are removed
     * @param message The message information, with optional color
     */
    public post(text: string): void {
        const obj = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontSize: 28,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: this.width - PADDING_HALF
        });
        
        this.messages.push({ text, obj });
        this.messageHeight += obj.height + PADDING;
        this.root.addChild(obj);

        // Ensure that the total message height is smaller than the space we have
        while (this.messageHeight > this.height) {
            const msg = this.messages.shift()!;
            this.messageHeight -= msg.obj.height + PADDING;
            msg.obj.removeFromParent();
        }

        // Then position all messages from top to bottom
        let y = PADDING_HALF;
        for (const msg of this.messages) {
            msg.obj.position.set(PADDING_HALF, y);
            y += msg.obj.height + PADDING;
        }
    }

    /**
     * Clear all displayed log messages
     */
    public clear(): void {
        for (const msg of this.messages) {
            msg.obj.removeFromParent();
        }
        (this.messages as any) = [];
    }
}