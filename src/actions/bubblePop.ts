import { EMPTY_TILE, TileCoordinate } from "../utils/mapUtils";
import { TileVectors } from "../models/tileVectors";
import { Board } from "../models/board";

export interface BubbleExplosionDetails {
  coordinates: TileCoordinate[],
  color: number
}

const MINIMUM_BUBBLE_POP_PAIRING_SIZE = 4;
const VISITED_TILE = 9;

// Class is responsible for parsing a board and detecting
export class BubblePopper {

  public static popBubbles(board: Board): boolean {
    let explosions: BubbleExplosionDetails[] = this.findBubblePopPixelPairs(board);
    explosions.forEach(function(e) {
      e.coordinates.forEach(function(c) {
        board.clearTile(c);
      }, this);
    }, this);

    return explosions.length > 0;
  }

  private static findBubblePopPixelPairs(originalBoard: Board): BubbleExplosionDetails[] {
    let result: BubbleExplosionDetails[] = [];
    let board: number[][] = originalBoard.getBoardIntArrayClone();
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[0].length; x++) {
        if (board[y] == null || board[y][x] == null || board[y][x] === EMPTY_TILE) {
          continue;
        }
        let color: number = board[y][x];
        let connectedTilesCoordinates: TileCoordinate[] = this.getAllConnectedColorCoordinate(board, x, y, color);
        if (connectedTilesCoordinates.length >= MINIMUM_BUBBLE_POP_PAIRING_SIZE) {
          result.push({coordinates: connectedTilesCoordinates, color: color});
        }
      }
    }
    return result;
  }
  
  private static getAllConnectedColorCoordinate(board: number[][], x: number, y: number, color: number): TileCoordinate[] {
    if (!this.isValidTile(x, y, board) || board[y][x] !== color || board[y][x] == EMPTY_TILE || board[y][x] == VISITED_TILE) {
      return [];
    }
    board[y][x] = VISITED_TILE;

    let left: TileCoordinate[] = this.getAllConnectedColorCoordinate(board, x + TileVectors.LEFT_VECTOR.X, y + TileVectors.LEFT_VECTOR.Y, color);
    let right: TileCoordinate[] = this.getAllConnectedColorCoordinate(board, x + TileVectors.RIGHT_VECTOR.X, y + TileVectors.RIGHT_VECTOR.Y, color);
    let down: TileCoordinate[] = this.getAllConnectedColorCoordinate(board, x + TileVectors.DOWN_VECTOR.X, y + TileVectors.DOWN_VECTOR.Y, color);
    let up: TileCoordinate[] = this.getAllConnectedColorCoordinate(board, x + TileVectors.UP_VECTOR.X, y + TileVectors.UP_VECTOR.Y, color);

    let result: TileCoordinate[] = [{ X: x, Y: y }];
    result = result.concat(left);
    result = result.concat(right);
    result = result.concat(up);
    result = result.concat(down);
    return result;
  }

  private static isValidTile(x: number, y: number, board: number[][]) {
    return x >= 0 && y >= 0 && y < board.length && x < board[0].length;
  }
}
