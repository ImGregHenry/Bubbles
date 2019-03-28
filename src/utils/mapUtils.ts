export const TILE_WIDTH: number = 40;
export const TILE_HEIGHT: number = 40;

export const MAP_LEFT_BORDER_TILE_WIDTH = 2;
export const MAP_RIGHT_BORDER_TILE_WIDTH = 2;
export const MAP_BOTTOM_BORDER_TILE_HEIGHT = 2;

export const MAP_INNER_BOARD_TILE_WIDTH = 10;
export const MAP_INNER_BOARD_TILE_HEIGHT = 16;

export const MAP_INNER_BOARD_START_X_PIXEL = MAP_LEFT_BORDER_TILE_WIDTH * TILE_WIDTH;
export const MAP_INNER_BOARD_END_X_PIXEL = ( MAP_LEFT_BORDER_TILE_WIDTH + MAP_INNER_BOARD_TILE_WIDTH ) * TILE_WIDTH;
export const MAP_INNER_BOARD_END_Y_PIXEL = MAP_INNER_BOARD_TILE_HEIGHT * TILE_WIDTH;

export const MAP_FULL_TILE_HEIGHT = MAP_INNER_BOARD_TILE_HEIGHT + MAP_BOTTOM_BORDER_TILE_HEIGHT;
export const MAP_FULL_TILE_WIDTH = MAP_LEFT_BORDER_TILE_WIDTH + MAP_INNER_BOARD_TILE_WIDTH + MAP_RIGHT_BORDER_TILE_WIDTH;

//TODO: move to a tile util class
export const EMPTY_TILE = 0;
export const BOARD_BORDER_TILE_INDEX = 1;

export type TileCoordinate = {
  X: number;
  Y: number;
};
export type PixelCoordinate = {
  X: number;
  Y: number;
};

export class MapUtils {

  private static getInnerBoardTopLeftPixelCoordinate(): PixelCoordinate {
    return { X: MAP_LEFT_BORDER_TILE_WIDTH * TILE_WIDTH, Y: 0 };
  }

  public static convertTileCoordinateToWorldMapPixelCoordinate(coordinate: TileCoordinate): PixelCoordinate {
    let startCoordinate: PixelCoordinate = this.getInnerBoardTopLeftPixelCoordinate();
    return { X: coordinate.X * TILE_WIDTH + startCoordinate.X , Y: coordinate.Y * TILE_WIDTH + startCoordinate.Y };
  }
  
  public static convertInnerMapXPixelToTileIndex(x: number): number {
    return Math.floor(x / TILE_WIDTH) - MAP_LEFT_BORDER_TILE_WIDTH;
  }

  public static convertInnerMapYPixelToTileIndex(y: number): number {
    return Math.floor((y) / TILE_WIDTH);
  }

  public static generateBackgroundMap(): number[][] {
    let fullMap = [];
    for (let row = 0; row < MAP_FULL_TILE_HEIGHT; row++) {
      let mapRow = [];

      for (let col = 0; col < MAP_LEFT_BORDER_TILE_WIDTH; col++) {
        mapRow.push(BOARD_BORDER_TILE_INDEX);
      }

      for (let col = 0; col < MAP_INNER_BOARD_TILE_WIDTH; col++) {
        let tileVal = row >= MAP_INNER_BOARD_TILE_HEIGHT ? BOARD_BORDER_TILE_INDEX : EMPTY_TILE;
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
