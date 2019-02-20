
export const TILE_WIDTH = 40;
export const TILE_HEIGHT = 40;

export const MAP_LEFT_BORDER_TILE_WIDTH = 2;
export const MAP_RIGHT_BORDER_TILE_WIDTH = 2;
export const MAP_BOTTOM_BORDER_TILE_HEIGHT = 2;

export const MAP_INNER_BOARD_TILE_WIDTH = 10;
export const MAP_INNER_BOARD_TILE_HEIGHT = 16;

export const MAP_INNER_BOARD_START_X_PIXEL = MAP_LEFT_BORDER_TILE_WIDTH * TILE_WIDTH;
const MAP_INNER_BOARD_START_Y_PIXEL = 0;
export const MAP_INNER_BOARD_END_X_PIXEL = ( MAP_LEFT_BORDER_TILE_WIDTH + MAP_INNER_BOARD_TILE_WIDTH ) * TILE_WIDTH;
export const MAP_INNER_BOARD_END_Y_PIXEL = MAP_INNER_BOARD_TILE_HEIGHT * TILE_WIDTH;

export const MAP_FULL_TILE_HEIGHT = MAP_INNER_BOARD_TILE_HEIGHT + MAP_BOTTOM_BORDER_TILE_HEIGHT;
export const MAP_FULL_TILE_WIDTH = MAP_LEFT_BORDER_TILE_WIDTH + MAP_INNER_BOARD_TILE_WIDTH + MAP_RIGHT_BORDER_TILE_WIDTH;

export const MAP_RIGHT_BORDER_STARTING_TILE_WIDTH = MAP_LEFT_BORDER_TILE_WIDTH + MAP_INNER_BOARD_TILE_WIDTH;

export const BUBBLE_POSITION_X_OFFSET = TILE_WIDTH / 2;
export const BUBBLE_POSITION_Y_OFFSET = TILE_HEIGHT / 2;

//TODO: move to a tile util class
const BOARD_INNER_TILE_INDEX = 0;
const BOARD_BORDER_TILE_INDEX = 1;



export declare interface Coordinate {
  X: number;
  Y: number;
}

export class MapUtils {

  private static isValidXBoundary(x: number) {
    return x >= MAP_INNER_BOARD_START_X_PIXEL && x <= MAP_INNER_BOARD_END_X_PIXEL;
  }
  private static isValidYBoundary(y: number) {
    return y <= MAP_INNER_BOARD_END_Y_PIXEL;
  }

  public static isValidXBoundaryWithIncrement(currX: number, increment: number): boolean {
    let newX = currX + increment;
    return this.isValidXBoundary(newX);
  }

  public static isValidYBoundaryWithIncrement(currY: number, increment: number): boolean {
    let newY = currY + increment;
    return this.isValidYBoundary(newY);
  }

  public static isValidCoordinateBoundary(coordinate: Coordinate): boolean {
    return this.isValidXBoundary(coordinate.X) && this.isValidYBoundary(coordinate.Y);
  }

  public static isLeftMostInnerBoundaryCoordinate(coordinate: Coordinate): boolean {
    return coordinate.X === (MAP_INNER_BOARD_START_X_PIXEL + BUBBLE_POSITION_X_OFFSET);
  }

  public static isRightMostInnerBoundaryCoordinate(coordinate: Coordinate): boolean {
    return coordinate.X === (MAP_INNER_BOARD_END_X_PIXEL - BUBBLE_POSITION_X_OFFSET);
  }

  public static isBottomMostInnerBoundaryCoordinate(coordinate: Coordinate): boolean {
    return coordinate.Y === (MAP_INNER_BOARD_END_Y_PIXEL - BUBBLE_POSITION_Y_OFFSET);
  }

  public static getInnerBoardStartingCoordinate(): Coordinate {
    return this.convertTileIndexToWorldMapCoordinate(4, -2);
  }

  public static getInnerBoardTopLeftPixelCoordinate(): Coordinate {
    return { X: MAP_LEFT_BORDER_TILE_WIDTH*TILE_WIDTH, Y: 0 };
  }

  public static convertTileIndexToWorldMapCoordinate(x: number, y: number): Coordinate {
    let startCoordinate: Coordinate = this.getInnerBoardTopLeftPixelCoordinate();
    return { X: x*TILE_WIDTH + startCoordinate.X, Y: y*TILE_WIDTH + startCoordinate.Y };
  }

  public static generateMap(): number[][] {
    let fullMap = [];
    for (let row = 0; row < MAP_FULL_TILE_HEIGHT; row++) {
      let mapRow = [];

      for (let col = 0; col < MAP_LEFT_BORDER_TILE_WIDTH; col++) {
        mapRow.push(BOARD_BORDER_TILE_INDEX);
      }

      //TODO: clean up this logic
      for (let col = 0; col < MAP_INNER_BOARD_TILE_WIDTH; col++) {
        let tileVal = row >= MAP_INNER_BOARD_TILE_HEIGHT ? BOARD_BORDER_TILE_INDEX : BOARD_INNER_TILE_INDEX;
        mapRow.push(tileVal);
      }

      for (let col = 0; col < MAP_RIGHT_BORDER_TILE_WIDTH; col++) {
        mapRow.push(BOARD_BORDER_TILE_INDEX);
      }
      fullMap.push(mapRow);
    }

    return fullMap;
  }
}
