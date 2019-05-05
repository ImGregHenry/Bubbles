import { TileCoordinate } from "./utils/mapUtils";
import { Board, EMPTY_BUBBLE_SPRITE } from "./models/board";
import { BubbleSprite } from "./models/bubbleSprite";
import { BubbleSpritePair } from "./models/bubbleSpritePair";
import { BubbleTileCoordinatePair, BubbleUtils, BubbleOrientation } from "./utils/bubbleUtils";
import { BubbleSpawnManager } from "./bubbleSpawnManager";
import { TileVector, TileVectors } from "./models/tileVectors";
import { RotationDirection } from "./keyboardControls";
import { MainScene } from "./scenes/mainScene";

export interface BubbleDropVector {
  start: TileCoordinate,
  end: TileCoordinate
}


export class BoardTracker {
  private board: Board;
  private bubbleSpawnManager: BubbleSpawnManager;
  private context: MainScene;

  constructor(context: MainScene, bubbleSpawnManager: BubbleSpawnManager) {
    this.context = context;
    this.board = new Board();
    this.bubbleSpawnManager = bubbleSpawnManager;
  }

  public getBoard(): Board {
    return this.board;
  }

  public calculateBubbleDropVectors(): BubbleDropVector[] {
    let dropVectors: BubbleDropVector[] = [];

    for (let x: number = this.board.getMaxX() - 1; x >= 0; x--) {
      let firstAvailable: number = null;

      for (let y: number = this.board.getMaxY() - 1; y >= 0; y--) {
        if (!firstAvailable) {
          if (this.board.isTileOccupied(x, y)) {
            continue;
          }
          firstAvailable = y;
        } else {
          if (!this.board.isTileOccupied(x, y)) {
            continue;
          }
          dropVectors.push(this.createDropVector(x, y, x, firstAvailable));
          firstAvailable--;
        }
      }
    }
    return dropVectors;
  }

  private createDropVector(startX: number, startY: number, endX: number, endY: number): BubbleDropVector {
    //TODO: create a class for drop vector and enhance with actual vectors.
    let dropVector: BubbleDropVector = { start: { X: startX, Y: startY }, end: { X: endX, Y: endY } };
    return dropVector;
  }

  public updateTileLocationsAfterDrops(dropVectors: BubbleDropVector[]): void {
    dropVectors.forEach(vector => {
      this.board.put(vector.end, this.board.get(vector.start));
      this.board.put(vector.start, EMPTY_BUBBLE_SPRITE);
    });
  }

  public putBubbleSpriteByTile(sprite: BubbleSprite): void {
    const coordinate: TileCoordinate = sprite.getTileCoordinate();
    if (this.board.isValidTileBoundary(coordinate.X, coordinate.Y)) {
      this.board.put(coordinate, sprite);
    }
  }

  public startForcedSpaceBarDrop(): void {
    const bubble1: BubbleSprite = this.bubbleSpawnManager.getActiveBubblePair().getBubble1();
    const bubble2: BubbleSprite = this.bubbleSpawnManager.getActiveBubblePair().getBubble2();

    const updatedBubbleTileCoordinates: BubbleTileCoordinatePair = this.board.calculateLowestVerticalDropPointForPair(bubble1.getTileCoordinate(), bubble2.getTileCoordinate());
    const bubble1EndTileCoordinate: TileCoordinate = updatedBubbleTileCoordinates.bubble1Coordinate;
    const bubble2EndTileCoordinate: TileCoordinate = updatedBubbleTileCoordinates.bubble2Coordinate;
    const dropVectors: BubbleDropVector[] = [
      { start: bubble1.getTileCoordinate(), end: bubble1EndTileCoordinate },
      { start: bubble2.getTileCoordinate(), end: bubble2EndTileCoordinate }
    ];
    
    this.board.clearTile(bubble1.getTileCoordinate());
    this.board.clearTile(bubble2.getTileCoordinate());
    
    bubble1.setTilePosition(bubble1EndTileCoordinate);
    bubble2.setTilePosition(bubble2EndTileCoordinate);

    this.updateTileLocationsAfterDrops(dropVectors);
  }

  public spawnActiveBubblePair(): void {
    //TODO: this should probably be event driven instead
    const bubblePair: BubbleSpritePair = this.bubbleSpawnManager.spawnNewBubble();
  }

  public rotateActiveBubble(rotationDirection: RotationDirection): void {
    const bubble1: BubbleSprite = this.bubbleSpawnManager.getActiveBubble1();
    const bubble2: BubbleSprite = this.bubbleSpawnManager.getActiveBubble2();
    const currentOrientation: BubbleOrientation = this.bubbleSpawnManager.getActiveBubblePair().getOrientation();

    const coordinatePairPostRotation: BubbleTileCoordinatePair
      = BubbleUtils.getCoordinatePairAfterRotation( bubble1.getTileCoordinate(), bubble2.getTileCoordinate(), currentOrientation, rotationDirection, this.getBoard());

    if (coordinatePairPostRotation) {
      const newOrientation = BubbleUtils.changeOrientationByRotation(currentOrientation, rotationDirection);
      this.bubbleSpawnManager.getActiveBubblePair().setOrientation(newOrientation);
      
      bubble1.setTilePosition(coordinatePairPostRotation.bubble1Coordinate);
      bubble2.setTilePosition(coordinatePairPostRotation.bubble2Coordinate);
    }
  }

  public moveActiveBubble(tileVector: TileVector): void {
    const bubble1: BubbleSprite = this.bubbleSpawnManager.getActiveBubblePair().getBubble1();
    const bubble2: BubbleSprite = this.bubbleSpawnManager.getActiveBubblePair().getBubble2();
    
    if (tileVector === TileVectors.DROP_VECTOR) {
      this.startForcedSpaceBarDrop();
      this.stopBubbles();
      this.context.bubbleDropPopLoop();
    } else if (this.getBoard().isTileValidAndNotOccupiedAfterTileVector(bubble1.getTileCoordinate(), tileVector)
        && this.getBoard().isTileValidAndNotOccupiedAfterTileVector(bubble2.getTileCoordinate(), tileVector)) {
      bubble1.moveTileByTileVector(tileVector);
      bubble2.moveTileByTileVector(tileVector);
    } else if (tileVector === TileVectors.DOWN_VECTOR) {
      this.stopBubbles();
      this.context.bubbleDropPopLoop();
    }
  }
  
  private stopBubbles() {
    const termiantedBubblePair: BubbleSpritePair = this.bubbleSpawnManager.stopActiveBubblePair();
    this.putBubbleSpriteByTile(termiantedBubblePair.getBubble1());
    this.putBubbleSpriteByTile(termiantedBubblePair.getBubble2());
  }
}
