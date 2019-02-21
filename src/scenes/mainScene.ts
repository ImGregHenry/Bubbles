import {
  BUBBLE_POSITION_X_OFFSET, BUBBLE_POSITION_Y_OFFSET,
  Coordinate,
  MapUtils,
  TILE_HEIGHT
} from '../mapUtils';
import { KeyboardControls, RotationDirection } from '../KeyboardControls';
import { BubbleColor, BubbleOrientation, BubbleUtils, DATA_KEY_COLOR_NAME } from '../bubbleUtils';
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import { TileUtils } from '../tileUtils';
import Sprite = Phaser.Physics.Arcade.Sprite;
import { BoardTracker } from '../boardTracker';



export class MainScene extends Phaser.Scene {
  private keyboardControls: KeyboardControls;
  private boardTracker: BoardTracker;
  private staticTileMapLayer: StaticTilemapLayer;
  private activeBubble1: Sprite;
  private activeBubble2: Sprite;
  private currentOrientation: BubbleOrientation = BubbleOrientation.VERTICAL_1_TOP;


  constructor() {
    super({key: "MainScene"});
  }

  preload(): void {
    this.load.image("tile-sheet", "./src/assets/tile-sheet.png");
    this.load.image("tile-bubble-sheet", "./src/assets/tile-bubble-sheet.png");
    this.load.image(BubbleColor.RED.imageName, "./src/assets/bubble-red.png");
    this.load.image(BubbleColor.BLUE.imageName, "./src/assets/bubble-blue.png");
    this.load.image(BubbleColor.PURPLE.imageName, "./src/assets/bubble-purple.png");
    this.load.image(BubbleColor.YELLOW.imageName, "./src/assets/bubble-yellow.png");
    this.load.image(BubbleColor.ORANGE.imageName, "./src/assets/bubble-orange.png");
    this.load.image(BubbleColor.GREEN.imageName, "./src/assets/bubble-green.png");
    this.load.image(BubbleColor.GREEN.imageName, "./src/assets/bubble-green.png");
  }

  create(): void {
    this.boardTracker = new BoardTracker(this);
    const boardJson = MapUtils.generateMap();

    const map = this.make.tilemap({ data: boardJson, tileWidth: 40, tileHeight: 40 });
    const tiles = map.addTilesetImage("tile-sheet", "tile-sheet", 40, 40);

    this.staticTileMapLayer = map.createStaticLayer(0, tiles, 0, 0);

    this.createActiveBubblePair();

    this.keyboardControls =  new KeyboardControls(this);
    this.keyboardControls.bindMovementKeys(this.moveActiveBubble);
    this.keyboardControls.bindRotateKeys(this.rotateActiveBubble);
    this.keyboardControls.startDownwardMovement(this.moveActiveBubble);
  }

  update(): void {
  }

  moveActiveBubble(vector: Coordinate): void {
    if(MapUtils.isValidXBoundaryWithIncrement(this.activeBubble1.x, vector.X) && MapUtils.isValidXBoundaryWithIncrement(this.activeBubble2.x, vector.X)
      && !this.boardTracker.isTileOccupiedByPixelWithVector(this.activeBubble1.x, this.activeBubble1.y, vector)
      && !this.boardTracker.isTileOccupiedByPixelWithVector(this.activeBubble2.x, this.activeBubble2.y, vector)
      && MapUtils.isValidYBoundaryWithIncrement(this.activeBubble1.y, vector.Y) && MapUtils.isValidYBoundaryWithIncrement(this.activeBubble2.y, vector.Y)) {
      this.activeBubble1.setPosition(this.activeBubble1.x + vector.X, this.activeBubble1.y + vector.Y);
      this.activeBubble2.setPosition(this.activeBubble2.x + vector.X, this.activeBubble2.y + vector.Y);
    } else if (vector === TileUtils.MOVE_DOWN_VECTOR) {
      if ( !this.boardTracker.isTileOccupiedByPixelWithVector(this.activeBubble1.x, this.activeBubble1.y, vector)
        || !this.boardTracker.isTileOccupiedByPixelWithVector(this.activeBubble2.x, this.activeBubble2.y, vector)){
        //TODO: handle splitting active bubbles when a half an active bubble collision occurs
      }
      this.stopBubble(this.activeBubble1);
      this.stopBubble(this.activeBubble2);
      this.createActiveBubblePair();
    }
  }

  stopBubble(activeBubble: Sprite) {
    let color1 = activeBubble.getData(DATA_KEY_COLOR_NAME);
    this.physics.add.sprite(activeBubble.x, activeBubble.y, color1);
    activeBubble.destroy(true);
    this.boardTracker.putBubbleByPixel(activeBubble.x, activeBubble.y, BubbleUtils.convertBubbleColorImageNameToNumValue(color1));
  }

  rotateActiveBubble(rotationDirection: RotationDirection): void {
    let newOrientation = BubbleUtils.changeOrientationByRotation(this.currentOrientation, rotationDirection);

    //TODO: need to account for existing bubbles on the board.
    let bubble1NewCoordinate: Coordinate = BubbleUtils.getBubble1CoordinateAfterRotation({X: this.activeBubble1.x, Y: this.activeBubble1.y}, this.currentOrientation, rotationDirection);
    let bubble2NewCoordinate: Coordinate = BubbleUtils.getBubbleTwoCoordinateAfterRotation(bubble1NewCoordinate, newOrientation);
    this.activeBubble1.setPosition(bubble1NewCoordinate.X, bubble1NewCoordinate.Y);
    this.activeBubble2.setPosition(bubble2NewCoordinate.X, bubble2NewCoordinate.Y);

    this.currentOrientation = newOrientation;
  }

  //TODO: move me somewhere else
  createActiveBubblePair(): void {
    //TODO: preview next generated bubble pair.
    let color1 = BubbleUtils.generateRandomBubbleColorImageName();
    let color2 = BubbleUtils.generateRandomBubbleColorImageName();

    this.activeBubble1 = this.physics.add.sprite(MapUtils.getInnerBoardBubbleStartingCoordinate().X + BUBBLE_POSITION_X_OFFSET,
        MapUtils.getInnerBoardBubbleStartingCoordinate().Y - BUBBLE_POSITION_Y_OFFSET,
        color1);
    this.activeBubble1.setData(DATA_KEY_COLOR_NAME, color1);

    this.activeBubble2 = this.physics.add.sprite(this.activeBubble1.x, this.activeBubble1.y + TILE_HEIGHT, color2);
    this.activeBubble2.setData(DATA_KEY_COLOR_NAME, color2);

    this.currentOrientation = BubbleOrientation.VERTICAL_1_TOP;
  }
}
