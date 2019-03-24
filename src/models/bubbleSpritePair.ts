import { BubbleOrientation, BubbleCoordinatePair, BubbleUtils } from "../utils/bubbleUtils";
import { MainScene } from "../scenes/mainScene";
import { MapUtils, BUBBLE_POSITION_X_OFFSET, BUBBLE_POSITION_Y_OFFSET, TILE_WIDTH, TILE_HEIGHT, Coordinate } from "../utils/mapUtils";
import { BubbleSprite } from "./bubbleSprite";
import { RotationDirection } from "../KeyboardControls";
import { BoardTracker } from "../boardTracker";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { TileUtils } from "../utils/tileUtils";


export class BubbleSpritePair {
  private mainScene: MainScene;
  private boardTracker: BoardTracker;
  private bubble1: BubbleSprite;
  private bubble2: BubbleSprite;
  private currentOrientation: BubbleOrientation = BubbleOrientation.VERTICAL_1_TOP;

  constructor(mainScene: MainScene, boardtracker: BoardTracker) {
    this.mainScene = mainScene;
    this.boardTracker = boardtracker;
    
    this.createActiveBubblePair();
  }

  createActiveBubblePair(): void {
    //TODO: find a way of abstracting away this sprite offset.
    this.bubble1 = new BubbleSprite(this.mainScene, MapUtils.getInnerBoardBubbleStartingCoordinate().X  + BUBBLE_POSITION_X_OFFSET, MapUtils.getInnerBoardBubbleStartingCoordinate().Y - BUBBLE_POSITION_Y_OFFSET);
    this.bubble2 = new BubbleSprite(this.mainScene, this.bubble1.getX(), this.bubble1.getY() + TILE_HEIGHT);
  }

  rotateActiveBubble(rotationDirection: RotationDirection): void {
    let bubble1Coordinate: Coordinate = { X: this.bubble1.getX(), Y: this.bubble1.getY() };
    let bubble2Coordinate: Coordinate = { X: this.bubble2.getX(), Y: this.bubble2.getY() };

    let coordinatePairPostRotation: BubbleCoordinatePair 
      = BubbleUtils.getCoordinatePairAfterRotation( bubble1Coordinate, bubble2Coordinate, this.currentOrientation, rotationDirection, this.boardTracker);

    if (coordinatePairPostRotation) {
      let newOrientation = BubbleUtils.changeOrientationByRotation(this.currentOrientation, rotationDirection);
      this.currentOrientation = newOrientation;

      this.bubble1.setPosition(coordinatePairPostRotation.bubble1Coordinate.X, coordinatePairPostRotation.bubble1Coordinate.Y);
      this.bubble2.setPosition(coordinatePairPostRotation.bubble2Coordinate.X, coordinatePairPostRotation.bubble2Coordinate.Y);
    }
  }

  moveActiveBubble(vector: Coordinate): void {
    if (MapUtils.isValidXBoundaryWithIncrement(this.bubble1.getX(), vector.X) && MapUtils.isValidXBoundaryWithIncrement(this.bubble2.getX(), vector.X)
        && MapUtils.isValidYBoundaryWithIncrement(this.bubble1.getY(), vector.Y) && MapUtils.isValidYBoundaryWithIncrement(this.bubble2.getY(), vector.Y)
        && !this.boardTracker.isTileOccupiedByPixelWithVector(this.bubble1.getX(), this.bubble1.getY(), vector)
        && !this.boardTracker.isTileOccupiedByPixelWithVector(this.bubble2.getX(), this.bubble2.getY(), vector)) {
      this.bubble1.setPosition(this.bubble1.getX() + vector.X, this.bubble1.getY() + vector.Y);
      this.bubble2.setPosition(this.bubble2.getX() + vector.X, this.bubble2.getY() + vector.Y);
    } else if (vector === TileUtils.MOVE_DOWN_VECTOR) {
      this.stopBubbles();

      this.mainScene.startBubbleDropPopLoop();
    }
  }
  
  stopBubbles() {
    this.stopBubble(this.bubble1);
    this.stopBubble(this.bubble2);
  }
    
  stopBubble(activeBubble: BubbleSprite) {
    let color1 = activeBubble.getColor();
    let sprite: Sprite = this.mainScene.physics.add.sprite(activeBubble.getX(), activeBubble.getY(), color1);
    activeBubble.destroy();
    this.boardTracker.putBubbleSpriteByPixel(activeBubble.getX(), activeBubble.getY(), sprite);
    this.boardTracker.putBubbleByPixel(activeBubble.getX(), activeBubble.getY(), BubbleUtils.convertBubbleColorImageNameToNumValue(color1));
  }
}
