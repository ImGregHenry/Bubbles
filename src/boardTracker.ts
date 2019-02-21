import { MainScene } from './scenes/mainScene';
import { Coordinate, MAP_INNER_BOARD_TILE_HEIGHT, MAP_INNER_BOARD_TILE_WIDTH, MapUtils, TILE_WIDTH } from './mapUtils';


const EMPTY_SPOT = 0;

export class BoardTracker {
  private board: number[][] = [[]];
  private context;
  constructor(context: MainScene) {
    this.context = context;
    this.initBoard();
  }

  private initBoard() {
    this.board = [];
    for(let j = 0; j < MAP_INNER_BOARD_TILE_HEIGHT; j++) {
      let row = [];
      for(let i = 0; i < MAP_INNER_BOARD_TILE_WIDTH; i++) {
        row.push(EMPTY_SPOT);
      }
      this.board.push(row);
    }
    console.log(this.board);
  }

  public putBubbleByPixel(pixelX: number, pixelY: number, val: number) {
    this.putBubbleByTile(MapUtils.convertInnerMapXPixelToTileIndex(pixelX),
      MapUtils.convertInnerMapYPixelToTileIndex(pixelY), val);
  }

  public putBubbleByTile(tileX: number, tileY: number, val: number) {
    if(!this.isValidBoundary(tileX, tileY)) {
      return;
    }
    this.board[tileY][tileX] = val;
  }

  public isTileOccupied(x: number, y: number) {
    if(!this.isValidBoundary(x,y)) {
      return;
    }
    return this.board[y][x] !== EMPTY_SPOT;
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

  private isValidBoundary(x: number, y: number) {
    if ( x < 0 ||  y < 0
      || y >= this.board.length || x >= this.board[0].length) {
      return false;
    } else {
      return true;
    }
  }

  private convertVectorToTileVector(vector: Coordinate): Coordinate {
    return {X: vector.X / TILE_WIDTH, Y: vector.Y / TILE_WIDTH };
  }
}

