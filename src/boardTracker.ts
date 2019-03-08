import { MainScene } from './scenes/mainScene';
import {
  Coordinate,
  EMPTY_TILE,
  MAP_INNER_BOARD_TILE_HEIGHT,
  MAP_INNER_BOARD_TILE_WIDTH,
  MapUtils,
  TILE_WIDTH, VISITED_TILE
} from './mapUtils';
import { BubbleExplosionDetails, MINIMUM_BUBBLE_POP_PAIRING_SIZE } from './bubbleUtils';
import { TileUtils } from './tileUtils';
import Sprite = Phaser.Physics.Arcade.Sprite;


export class BoardTracker {
  private board: number[][] = [];
  private bubbleBoard: Sprite[][] = [];
  private context: MainScene;

  constructor(context: MainScene) {
    this.context = context;
    this.initBoard();
    this.initBoard();
  }

  private initBoard() {
    this.board = [];
    this.bubbleBoard = [];
    for(let j = 0; j < MAP_INNER_BOARD_TILE_HEIGHT; j++) {
      let row = [];
      let bubbleRow = [];
      for(let i = 0; i < MAP_INNER_BOARD_TILE_WIDTH; i++) {
        row.push(EMPTY_TILE);
        bubbleRow.push(null);
      }
      this.board.push(row);
      this.bubbleBoard.push(bubbleRow);
    }
  }

  public putBubbleByPixel(pixelX: number, pixelY: number, val: number) {
    this.putBubbleByTile(MapUtils.convertInnerMapXPixelToTileIndex(pixelX),
      MapUtils.convertInnerMapYPixelToTileIndex(pixelY), val);
  }

  public putBubbleByTile(tileX: number, tileY: number, val: number) {
    if(!MapUtils.isValidTileBoundary(this.board, tileX, tileY)) {
      return;
    }

    this.board[tileY][tileX] = val;
  }

  public isTileOccupiedByPixelCoordinate(coordinate: Coordinate): boolean {
    return this.isTileOccupied(MapUtils.convertInnerMapXPixelToTileIndex(coordinate.X), MapUtils.convertInnerMapYPixelToTileIndex(coordinate.Y));
  }

  public isTileOccupied(tileX: number, tileY: number): boolean {
    if(!MapUtils.isValidTileBoundary(this.board, tileX, tileY)) {
      return false;
    }
    return this.board[tileY][tileX] !== EMPTY_TILE;
  }

  public isTileOccupiedByPixelWithVector(pixelX: number, pixelY: number, vector: Coordinate) {
    return this.isTileOccupiedWithVector(MapUtils.convertInnerMapXPixelToTileIndex(pixelX),
      MapUtils.convertInnerMapYPixelToTileIndex(pixelY), this.convertVectorToTileVector(vector));
  }

  public isTileOccupiedWithVector(tileX: number, tileY: number, tileVector: Coordinate) {
    let newX = tileX + tileVector.X;
    let newY = tileY + tileVector.Y;

    return this.isTileOccupied(newX, newY);
  }

  private convertVectorToTileVector(vector: Coordinate): Coordinate {
    return {X: vector.X / TILE_WIDTH, Y: vector.Y / TILE_WIDTH };
  }

  public getBubbleSpriteFromBoard(tileX: number, tileY: number): Sprite {
    if (MapUtils.isValidTileBoundary(this.board, tileX, tileY)) {
      return this.bubbleBoard[tileY][tileX];
    }
    return null;
  }

  public putBubbleSpriteByPixel(pixelX: number, pixelY: number, sprite: Sprite): void {
    let x = MapUtils.convertInnerMapXPixelToTileIndex(pixelX);
    let y = MapUtils.convertInnerMapYPixelToTileIndex(pixelY);
    this.putBubbleSpriteByTile(x, y, sprite);
  }

  public putBubbleSpriteByTile(tileX: number, tileY: number, sprite: Sprite): void {
    if (MapUtils.isValidTileBoundary(this.board, tileX, tileY)) {
      this.bubbleBoard[tileY][tileX] = sprite;
    }
  }



  public findBubblePopPixelPairs(): BubbleExplosionDetails[] {
    let result: BubbleExplosionDetails[] = [];
    let board: number[][] = this.cloneBoard(this.board);
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        if (board[y] == null || board[y][x] == null || board[y][x] === EMPTY_TILE) {
          continue;
        }
        let color: number = board[y][x];
        let connectedTilesCoordinates: Coordinate[] = this.getAllConnectedColorCoordinate(board, x, y, color);
        if (connectedTilesCoordinates.length >= MINIMUM_BUBBLE_POP_PAIRING_SIZE) {
          result.push({coordinates: connectedTilesCoordinates, color: color});
        }
      }
    }
    return result;
  }

  private cloneBoard(board: number[][]): number[][] {
    return JSON.parse(JSON.stringify(board));
  }

  private getAllConnectedColorCoordinate(board: number[][], x: number, y: number, color: number): Coordinate[] {
    if (!MapUtils.isValidTileBoundary(board, x, y) || board[y][x] != color || board[y][x] == EMPTY_TILE || board[y][x] == VISITED_TILE) {
      return [];
    }
    board[y][x] = VISITED_TILE;

    let left: Coordinate[] = this.getAllConnectedColorCoordinate(board, x + TileUtils.TILE_LEFT_VECTOR.X, y + TileUtils.TILE_LEFT_VECTOR.Y, color);
    let right: Coordinate[] = this.getAllConnectedColorCoordinate(board, x + TileUtils.TILE_RIGHT_VECTOR.X, y + TileUtils.TILE_RIGHT_VECTOR.Y, color);
    let down: Coordinate[] = this.getAllConnectedColorCoordinate(board, x + TileUtils.TILE_DOWN_VECTOR.X, y + TileUtils.TILE_DOWN_VECTOR.Y, color);
    let up: Coordinate[] = this.getAllConnectedColorCoordinate(board, x + TileUtils.TILE_UP_VECTOR.X, y + TileUtils.TILE_UP_VECTOR.Y, color);

    let result: Coordinate[] = [{X: x, Y: y}];
    result = result.concat(left);
    result = result.concat(right);
    result = result.concat(up);
    result = result.concat(down);
    return result;
  }
}
