import { TileCoordinate } from "./utils/mapUtils";
import { Board, EMPTY_BUBBLE_SPRITE } from "./models/board";
import { BubbleSprite } from "./models/bubbleSprite";
import { BubbleSpritePair } from "./models/bubbleSpritePair";
import { BubbleTileCoordinatePair } from "./utils/bubbleUtils";

export interface BubbleDropVector {
  start: TileCoordinate,
  end: TileCoordinate
}


export class BoardTracker {
  private board: Board;

  constructor() {
    this.board = new Board();
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
    let dropVector: BubbleDropVector = { start: { X: startX, Y: startY }, end: { X: endX, Y: endY } };
    return dropVector;
  }

  public updateTileLocationsAfterDrops(dropVectors: BubbleDropVector[]): void {
    dropVectors.forEach(vector => {
      this.board.put(vector.end, this.board.get(vector.start));
      this.board.put(vector.start, EMPTY_BUBBLE_SPRITE);
    });
  }

  public putBubbleSpriteByTile(coordinate: TileCoordinate, sprite: BubbleSprite): void {
    if (this.board.isValidTileBoundary(coordinate.X, coordinate.Y)) {
      this.board.put(coordinate, sprite);
    }
  }

  public startForcedSpaceDrop(bubblePair: BubbleSpritePair): void {
    let bubble1: BubbleSprite = bubblePair.getBubble1();
    let bubble2: BubbleSprite = bubblePair.getBubble2();

    let updatedBubbleTileCoordinates: BubbleTileCoordinatePair = this.board.calculateLowestVerticalDropPointForPair(bubble1.getTileCoordinate(), bubble2.getTileCoordinate());
    let bubble1EndTileCoordinate: TileCoordinate = updatedBubbleTileCoordinates.bubble1Coordinate;
    let bubble2EndTileCoordinate: TileCoordinate = updatedBubbleTileCoordinates.bubble2Coordinate;
    let dropVectors: BubbleDropVector[] = [
      { start: bubble1.getTileCoordinate(), end: bubble1EndTileCoordinate },
      { start: bubble2.getTileCoordinate(), end: bubble2EndTileCoordinate }
    ];
    
    this.board.clearTile(bubble1.getTileCoordinate());
    this.board.clearTile(bubble2.getTileCoordinate());
    
    bubblePair.getBubble1().setTilePosition(bubble1EndTileCoordinate);
    bubblePair.getBubble2().setTilePosition(bubble2EndTileCoordinate);

    this.updateTileLocationsAfterDrops(dropVectors);
  }
}
