import { Coordinate, TILE_HEIGHT, TILE_WIDTH } from './mapUtils';


export class TileUtils {
  public static MOVE_LEFT_VECTOR: Coordinate = {X: -TILE_WIDTH, Y: 0};
  public static MOVE_RIGHT_VECTOR: Coordinate = {X: TILE_WIDTH, Y: 0};
  public static MOVE_UP_VECTOR: Coordinate = {X: 0, Y: -TILE_HEIGHT};
  public static MOVE_DOWN_VECTOR: Coordinate = {X: 0, Y: TILE_HEIGHT};
}
