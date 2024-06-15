import type { Container, ColorSource, ITextStyle, Point } from "pixi.js";
import { Colors, Constants } from "../constants";
import { Util } from "../util";


export class InfoPanel {

    readonly root: Container;
    readonly width: number;
    readonly height: number;

    readonly infoBox: InfoBox;
    readonly gameStateBox: GameStateBox;
    

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
        this.gameStateBox = new GameStateBox(this);

        parent.addChild(this.root);
    }

    onClick(point: Point): boolean {
        return Util.tryClick(this.gameStateBox, point);
            // can chain additional things here with &&, i.e. short circuiting
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



export class GameStateBox {
    readonly root: Container;
    readonly width: number;
    readonly height: number;

    private readonly gameStateContainer: Container;
    private readonly arrowBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    };

    constructor(parent: InfoPanel) {
        this.root = new PIXI.Container();
        this.root.position.set(0, 0);
        
        this.width = 0.9 * parent.width;
        this.height = 0.2 * parent.height;

        let x = parent.width * 0.05;
        let y = parent.height * 0.05;
        const rect = new PIXI.Graphics()
            .lineStyle(5)
            .beginFill(Colors.LIGHT_BLUE_WHITE)
            .drawRoundedRect(x, y, this.width, this.height, 45)
            .endFill()
        this.root.addChild(rect)


        // Next turn arrow
        const arrowPoints = [
            new PIXI.Point(-3, 0),
            new PIXI.Point(10, 0),
            new PIXI.Point(10, -4),
            new PIXI.Point(17, 5),
            new PIXI.Point(10, 14),
            new PIXI.Point(10, 9),
            new PIXI.Point(-3, 9),
            new PIXI.Point(-3, 0),
        ] 
        // Offset the arrow to position it right
        const offset = new PIXI.Point(this.width * .95, this.height * 0.9);
        for (const point of arrowPoints) {
            point.x += offset.x;
            point.y += offset.y;
        }
        // Save click box
        this.arrowBox.x = arrowPoints[0].x;
        this.arrowBox.y = arrowPoints[2].y;
        this.arrowBox.width = arrowPoints[3].x
        this.arrowBox.height = arrowPoints[4].y
        //Render
        const tri = new PIXI.Graphics()
        .lineStyle(1)
        .beginFill(Colors.PASTEL_GREEN)
        .drawPolygon(arrowPoints)
        .endFill()
        this.root.addChild(tri)


        // Its this classes responsibility to dispose of old information
        // thus it manages the sub-container
        this.gameStateContainer = new PIXI.Container();
        this.gameStateContainer.position.set(x, y);
        this.root.addChild(this.gameStateContainer)

        parent.root.addChild(this.root);
    }


      /**
     * Update the info box with a new container. 
     */
      public updateGameStateUi(currentTurnTime: number, turnCounter: number, turnSeconds: number) {

        const newContainer = new PIXI.Container();

        // Time left timer
        let percentTurnTaken = currentTurnTime / (turnSeconds * 60);
        let timerTakenLength = percentTurnTaken * (this.width * 0.9);

        const timerInner = new PIXI.Graphics()
            .beginFill(Colors.LIGHT_RED)
            .drawRoundedRect(this.width * 0.05, this.height * 0.5, timerTakenLength, this.height * .1, 45)
            .endFill();
        newContainer.addChild(timerInner);

        const timerOuter = new PIXI.Graphics()
            .lineStyle(2)
            .drawRoundedRect(this.width * 0.05, this.height * 0.5, this.width * .9, this.height * .1, 45)
        newContainer.addChild(timerOuter);


        // Turn number
        const headerPos = new PIXI.Point(
            this.width * .1,
            this.height * .2
        );
        const headerContainer = new PIXI.Container();
        headerContainer.position.set(headerPos.x, headerPos.y);
        headerContainer.addChild(new PIXI.Text(`Turn: ${turnCounter}`, 
            {
                fontFamily: 'Arial',
                fontWeight: 'bold',
                fontSize: 28,
                fill: 'black',
                wordWrap: false,
            }
        ));
        newContainer.addChild(headerContainer);

        this.gameStateContainer.removeChildren();
        this.gameStateContainer.addChild(newContainer);
    }

    onClick(point: Point): boolean {

        if (Util.isIn(point.x, point.y, this.arrowBox.x, this.arrowBox.y, this.arrowBox.width, this.arrowBox.height)) {
            window.game.boardPanel.forceNextTurn = true;
            return true;
        }
        return false;
    }
}