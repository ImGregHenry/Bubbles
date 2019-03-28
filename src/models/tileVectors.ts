import { TileCoordinate } from "../utils/mapUtils";
import { ONE_TILE } from "../utils/bubbleUtils";

export interface TileVector {
  X: number,
  Y: number
}

export class TileVectors {
  public static LEFT_VECTOR: TileVector = {X: -ONE_TILE, Y: 0};
  public static RIGHT_VECTOR: TileVector = {X: ONE_TILE, Y: 0};
  public static UP_VECTOR: TileVector = {X: 0, Y: -ONE_TILE};
  public static DOWN_VECTOR: TileVector = {X: 0, Y: ONE_TILE};

  public static DROP_VECTOR: TileVector = {X: 0, Y: 99};
}
