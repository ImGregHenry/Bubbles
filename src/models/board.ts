import { MAP_INNER_BOARD_TILE_WIDTH, MAP_INNER_BOARD_TILE_HEIGHT, TileCoordinate, EMPTY_TILE } from "../utils/mapUtils";
import { BubbleSprite } from "./bubbleSprite";
import { TileVector } from "./tileVectors";
import { BubbleTileCoordinatePair } from "../utils/bubbleUtils";

export const EMPTY_BUBBLE_SPRITE: BubbleSprite = null;

export class Board {
  private board: BubbleSprite[][] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.board = [];
    for(let j = 0; j < MAP_INNER_BOARD_TILE_HEIGHT; j++) {
      let row = [];
      for(let i = 0; i < MAP_INNER_BOARD_TILE_WIDTH; i++) {
        row.push(EMPTY_BUBBLE_SPRITE);
      }
      this.board.push(row);
    }
  }

  public get(coordinate: TileCoordinate): BubbleSprite {
    return this._get(coordinate.X, coordinate.Y);
  }
  
  private _get(tileX: number, tileY: number): BubbleSprite {
    if (this.isValidTileBoundary(tileX, tileY)) {
      return this.board[tileY][tileX];
    }
    return null;
  }

  public getMaxX(): number {
    return this.board[0].length;
  }

  public getMaxY(): number {
    return this.board.length;
  }

  public put(coordinate: TileCoordinate, sprite: BubbleSprite) {
    this.board[coordinate.Y][coordinate.X] = sprite;
  }

  public isValidTileBoundary(x: number, y: number) {
    return x >= 0 && y >=0 && y < this.board.length && x < this.board[0].length;
  }

  public clearTile(coordinate: TileCoordinate) {
    if (this.isTileOccupied(coordinate.X, coordinate.Y)) {
      this._get(coordinate.X, coordinate.Y).destroy();
      this.putBubbleSpriteByTile(coordinate.X, coordinate.Y, EMPTY_BUBBLE_SPRITE);
    }
  }

  private putBubbleSpriteByTile(tileX: number, tileY: number, val: BubbleSprite) {
    if(!this.isValidTileBoundary(tileX, tileY)) {
      return;
    }

    this.board[tileY][tileX] = val;
  }

  public isTileOccupied(tileX: number, tileY: number): boolean {
    return this._get(tileX, tileY) !== EMPTY_BUBBLE_SPRITE;
  }

  public isTileValidAndNotOccupied(tile: TileCoordinate) {
    return this.isValidTileBoundary(tile.X, tile.Y) && !this.isTileOccupied(tile.X, tile.Y);
  }

  public isTileValidAndNotOccupiedAfterTileVector(startingTileCoordinate: TileCoordinate, tileVector: TileVector) {
    let newX = startingTileCoordinate.X + tileVector.X;
    let newY = startingTileCoordinate.Y + tileVector.Y;

    return this.isTileValidAndNotOccupied({ X: newX, Y: newY });
  }

  public getBoardIntArrayClone(): number[][] {

    let clone: number[][] = [];
    for (let y = 0; y < this.getMaxY(); y++) {
      let row = [];

      for (let x = 0; x < this.getMaxX(); x++) {

        let a = this._get(x, y);
        if (a != null) {
          row.push(this._get(x, y).getColorInt());
        } else {
          row.push(EMPTY_TILE);
        }
      }
      clone.push(row);
    }
    return clone;
  }

  private calculateLowestVerticalDropPoint(c: TileCoordinate) {
    for (let y = this.getMaxY() - 1; y > c.Y; y--) {
      if (!this.isTileOccupied(c.X, y)) {
        return y;
      }
    }
    return c.Y;
  }
  
  public calculateLowestVerticalDropPointForPair(c1: TileCoordinate, c2: TileCoordinate): BubbleTileCoordinatePair {
    let yMax = Math.min(this.calculateLowestVerticalDropPoint(c1), this.calculateLowestVerticalDropPoint(c2));
    let y1 = (c1.X === c2.X && c1.Y < c2.Y) ? yMax - 1 : yMax;
    let y2 = (c1.X === c2.X && c1.Y > c2.Y) ? yMax - 1 : yMax;
    return { bubble1Coordinate: { X: c1.X, Y: y1 }, bubble2Coordinate: { X: c2.X, Y: y2 } };
  }
}
