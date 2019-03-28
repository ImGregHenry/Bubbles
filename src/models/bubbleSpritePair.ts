import { BubbleOrientation, BubbleTileCoordinatePair, BubbleUtils, BUBBLE_1_STARTING_TILE_COORDINATE, BUBBLE_2_STARTING_TILE_COORDINATE } from "../utils/bubbleUtils";
import { MainScene } from "../scenes/mainScene";
import { BubbleSprite } from "./bubbleSprite";
import { RotationDirection } from "../keyboardControls";
import { BoardTracker } from "../boardTracker";
import { TileVectors, TileVector } from "./tileVectors";


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

  public getBubble1(): BubbleSprite {
    return this.bubble1;
  }

  public getBubble2(): BubbleSprite {
    return this.bubble2;
  }

  createActiveBubblePair(): void {
    this.bubble1 = new BubbleSprite(this.mainScene, BUBBLE_1_STARTING_TILE_COORDINATE);
    this.bubble2 = new BubbleSprite(this.mainScene, BUBBLE_2_STARTING_TILE_COORDINATE);
  }

  rotateActiveBubble(rotationDirection: RotationDirection): void {
    let coordinatePairPostRotation: BubbleTileCoordinatePair
      = BubbleUtils.getCoordinatePairAfterRotation( this.bubble1.getTileCoordinate(), this.bubble2.getTileCoordinate(), this.currentOrientation, rotationDirection, this.boardTracker.getBoard());

    if (coordinatePairPostRotation) {
      let newOrientation = BubbleUtils.changeOrientationByRotation(this.currentOrientation, rotationDirection);
      this.currentOrientation = newOrientation;
      
      this.bubble1.setTilePosition(coordinatePairPostRotation.bubble1Coordinate);
      this.bubble2.setTilePosition(coordinatePairPostRotation.bubble2Coordinate);
    }
  }

  moveActiveBubble(tileVector: TileVector): void {
    if (tileVector === TileVectors.DROP_VECTOR) {
      this.boardTracker.startForcedSpaceDrop(this);
      this.stopBubbles();
      this.mainScene.bubbleDropPopLoop();
      return;
    } else if (this.boardTracker.getBoard().isTileValidAndNotOccupiedAfterTileVector(this.bubble1.getTileCoordinate(), tileVector)
        && this.boardTracker.getBoard().isTileValidAndNotOccupiedAfterTileVector(this.bubble2.getTileCoordinate(), tileVector)) {
      this.bubble1.moveTileByTileVector(tileVector);
      this.bubble2.moveTileByTileVector(tileVector);
    } else if (tileVector === TileVectors.DOWN_VECTOR) {
      this.stopBubbles();
      this.mainScene.bubbleDropPopLoop();
    }
  }
  
  stopBubbles() {
    this.stopBubble(this.bubble1);
    this.stopBubble(this.bubble2);
  }
  
  stopBubble(activeBubble: BubbleSprite) {
    let color1 = activeBubble.getColor();
    activeBubble.destroy();
    let sprite: BubbleSprite = new BubbleSprite(this.mainScene, activeBubble.getTileCoordinate(), color1);
    this.boardTracker.putBubbleSpriteByTile(activeBubble.getTileCoordinate(), sprite);
  }
}
