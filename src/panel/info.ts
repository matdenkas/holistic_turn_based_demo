import type { Container, ColorSource, ITextStyle, Point, Graphics} from "pixi.js";
import { Colors, Constants } from "../constants";


export class InfoPanel {

    readonly root: Container;
    readonly width: number;
    readonly height: number;

    readonly infoBox: InfoBox;

    constructor(parent: Container) {
        this.root = new PIXI.Container();
        this.root.position.set(0, 0);
        this.width = 0.2 * Constants.WIDTH;
        this.height = Constants.HEIGHT;

        const rect = new PIXI.Graphics()
            .beginFill(Colors.LIGHT_CYAN)
            .drawRect(0, 0, this.width, this.height)
            .endFill();

        this.root.addChild(rect);

        this.infoBox = new InfoBox(this);

        parent.addChild(this.root);
    }
}


export class InfoBox {
    readonly root: Container;
    readonly width: number;
    readonly height: number;

    private readonly infoContainer: Container;

    constructor(parent: InfoPanel) {
        this.root = new PIXI.Container();
        this.root.position.set(0, 0);
        
        this.width = 0.9 * parent.width;
        this.height = 0.4 * parent.height;

        let x = parent.width * 0.05;
        let y = parent.height * 0.95 - this.height;
        const rect = new PIXI.Graphics()
            .lineStyle(5)
            .beginFill(Colors.LIGHT_BLUE_WHITE)
            .drawRoundedRect(x, y, this.width, this.height, 45)
            .endFill()
        this.root.addChild(rect)

        // Its this classes responsibility to dispose of old information
        // thus it manages the sub-container
        this.infoContainer = new PIXI.Container();
        this.infoContainer.position.set(x, y);
        this.root.addChild(this.infoContainer)

        parent.root.addChild(this.root);
    }

    /**
     * Update the info box with a new container. 
     */
    public updateInfoRaw(info: Container) {
        this.infoContainer.removeChildren();
        this.infoContainer.addChild(info);
    }

    /**
     * A helper method for updating the info box
     */
    public updateInfoColorPosHeaderBody(color: ColorSource, pos: Point, headerText: string, bodyText: string, headerStyle?: Partial<ITextStyle>, bodyStyle?: Partial<ITextStyle>) {

        // If no styles were defined we define defaults here
        headerStyle = this.sanitizeHeaderStyle(headerStyle);
        bodyStyle = this.sanitizeBodyStyle(bodyStyle);

        const newContainer = new PIXI.Container();

        // Color Circle
        const circleCenter = new PIXI.Point(
            this.width * 0.15,
            this.height * 0.1
        );
        const colorCircle = new PIXI.Graphics()
            .lineStyle(2)
            .beginFill(color)
            .drawCircle(circleCenter.x , circleCenter.y, circleCenter.x * 0.5) 
            .endFill();
        newContainer.addChild(colorCircle);
        

        // Header text
        const headerPos = new PIXI.Point(
            circleCenter.x * 2,
            circleCenter.y / 2
        );
        const headerContainer = new PIXI.Container();
        headerContainer.position.set(headerPos.x, headerPos.y);
        headerContainer.addChild(new PIXI.Text(headerText, headerStyle));
        newContainer.addChild(headerContainer);

        // Position Text
        const posPos = new PIXI.Point(
            circleCenter.x / 2,
            circleCenter.y * 2
        );
        const posContainer = new PIXI.Container();
        posContainer.position.set(posPos.x, posPos.y);
        posContainer.addChild(new PIXI.Text(`${pos.x.toString().length == 1 ? '0' : ''}${pos.x}\t-\t${pos.y.toString().length == 1 ? '0' : ''}${pos.y}`, bodyStyle));
        newContainer.addChild(posContainer);

        // Body Text
        const bodyPos = new PIXI.Point(
            headerPos.x,
            posPos.y
        );
        const bodyContainer = new PIXI.Container();
        bodyContainer.position.set(bodyPos.x, bodyPos.y);
        bodyContainer.addChild(new PIXI.Text(bodyText, bodyStyle));
        newContainer.addChild(bodyContainer);

        this.updateInfoRaw(newContainer);
    }


    private sanitizeHeaderStyle(style?: Partial<ITextStyle> | undefined){
        if (!style) {
            style = {
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fontSize: 28,
                fill: 'black',
                wordWrap: false,
            };
        }
        return style
    }


    private sanitizeBodyStyle(style?: Partial<ITextStyle> | undefined){
        if (!style) {
            style = {
                fontFamily: 'Arial',
                fontWeight: 'normal',
                fontSize: 20,
                fill: 'black',
                wordWrap: true,
                wordWrapWidth: this.width * 0.7
            };
        }
        return style
    }

    
}