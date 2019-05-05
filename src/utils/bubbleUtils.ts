import { TileCoordinate } from "./mapUtils";
import { RotationDirection } from "../keyboardControls";
import { Board } from "../models/board";

const TOTAL_BUBBLE_COLORS = 6;
export const DATA_KEY_COLOR_NAME = "COLOR-NAME";
export const ONE_TILE = 1;

export const BUBBLE_1_STARTING_TILE_COORDINATE: TileCoordinate = { X: 4, Y: 0 };
export const BUBBLE_2_STARTING_TILE_COORDINATE: TileCoordinate = { X: 4, Y: 1 };

export const BUBBLE_HIDDEN_SPAWN_TILE_COORDINATE: TileCoordinate = { X: -1, Y: -1 };

export const BubbleColor = {
  RED: { value: 1, imageName: "tile-bubble-red" },
  BLUE: { value: 2, imageName: "tile-bubble-blue" },
  PURPLE: { value: 3, imageName: "tile-bubble-purple" },
  YELLOW: { value: 4, imageName: "tile-bubble-yellow" },
  GREEN: { value: 5, imageName: "tile-bubble-green" },
  ORANGE: { value: 6, imageName: "tile-bubble-orange" },
};

export enum BubbleOrientation {
  VERTICAL_1_TOP,
  VERTICAL_1_BOTTOM,
  HORIZONTAL_1_LEFT,
  HORIZONTAL_1_RIGHT
}

export interface BubbleTileCoordinatePair {
  bubble1Coordinate: TileCoordinate;
  bubble2Coordinate: TileCoordinate;
}

export class BubbleUtils {
  public static convertBubbleColorImageNameToNumValue(name: string): number {
    for (let key in BubbleColor) {
      if(BubbleColor[key].imageName === name) {
        return BubbleColor[key].value;
      }
    }
    throw "Invalid bubble image name to color: " + name;
  }

  public static generateRandomBubbleColorImageName(): string {
    let val: number = this.getRandomInt(1, TOTAL_BUBBLE_COLORS);
    switch(val) {
      case BubbleColor.BLUE.value:
        return BubbleColor.BLUE.imageName;
      case BubbleColor.RED.value:
        return BubbleColor.RED.imageName;
      case BubbleColor.GREEN.value:
        return BubbleColor.GREEN.imageName;
      case BubbleColor.YELLOW.value:
        return BubbleColor.YELLOW.imageName;
      case BubbleColor.ORANGE.value:
        return BubbleColor.ORANGE.imageName;
      case BubbleColor.PURPLE.value:
        return BubbleColor.PURPLE.imageName;
      default:
        throw "Invalid bubble color: " + val;
    }
  }

  public static changeOrientationByRotation(currOrientation: BubbleOrientation, rotation: RotationDirection): BubbleOrientation {
    if ((currOrientation === BubbleOrientation.HORIZONTAL_1_LEFT && rotation === RotationDirection.CLOCKWISE)
      || currOrientation === BubbleOrientation.HORIZONTAL_1_RIGHT && rotation === RotationDirection.COUNTER_CLOCKWISE) {
      return BubbleOrientation.VERTICAL_1_TOP;
    } else if ((currOrientation === BubbleOrientation.HORIZONTAL_1_LEFT && rotation === RotationDirection.COUNTER_CLOCKWISE)
      || currOrientation === BubbleOrientation.HORIZONTAL_1_RIGHT && rotation === RotationDirection.CLOCKWISE) {
      return BubbleOrientation.VERTICAL_1_BOTTOM;
    } else if ((currOrientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.COUNTER_CLOCKWISE)
      || currOrientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.CLOCKWISE) {
      return BubbleOrientation.HORIZONTAL_1_LEFT;
    } else if ((currOrientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.CLOCKWISE)
      || currOrientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.COUNTER_CLOCKWISE) {
      return BubbleOrientation.HORIZONTAL_1_RIGHT;
    } else {
      throw "Invalid rotation.";
    }
  }

  // 1. Calc new coordinate
  // 2. Check valid coordinates
  // 3. If valid, return.  If not valid, calculate new coordinate.
  // 4.  Check new coordinate.  If invalid, return original coordinate.
  public static getCoordinatePairAfterRotation(bubble1StartCoordinate: TileCoordinate, bubble2StartCoordinate: TileCoordinate, currentOrientation: BubbleOrientation,
                                                rotationDirection: RotationDirection, board: Board): BubbleTileCoordinatePair {
    let newOrientation: BubbleOrientation = BubbleUtils.changeOrientationByRotation(currentOrientation, rotationDirection);
    let bubble2CoordinatePostRotation: TileCoordinate = this.getBubbleTwoCoordinateAfterRotation(bubble1StartCoordinate, newOrientation);

    if (this.isValidBubbleCoordinatePair({bubble1Coordinate: bubble1StartCoordinate, bubble2Coordinate: bubble2CoordinatePostRotation}, board)) {
      return { bubble1Coordinate: bubble1StartCoordinate, bubble2Coordinate: bubble2CoordinatePostRotation };
    }

    let bubble1CoordinatePostAdjustment: TileCoordinate = this.getBubble1CoordinateAfterInvalidRotation(bubble1StartCoordinate, currentOrientation, rotationDirection);
    let bubble2CoordinatePostAdjustment: TileCoordinate = this.getBubbleTwoCoordinateAfterRotation(bubble1CoordinatePostAdjustment, newOrientation);

    if (this.isValidBubbleCoordinatePair({bubble1Coordinate: bubble1StartCoordinate, bubble2Coordinate: bubble2CoordinatePostRotation}, board)) {
      return { bubble1Coordinate: bubble1CoordinatePostAdjustment, bubble2Coordinate: bubble2CoordinatePostAdjustment };
    }

    // Invalid rotation: return null to indicate no rotation occurred.
    return null;
  }

  private static isValidBubbleCoordinatePair(bubblePair: BubbleTileCoordinatePair, board: Board): boolean {
    return board.isTileValidAndNotOccupied(bubblePair.bubble1Coordinate) && board.isTileValidAndNotOccupied(bubblePair.bubble2Coordinate);
  }

  public static getBubble1CoordinateAfterInvalidRotation(coordinate: TileCoordinate, orientation: BubbleOrientation, rotation: RotationDirection): TileCoordinate {
    if ((orientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.COUNTER_CLOCKWISE )
        || (orientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.CLOCKWISE)) {
        return {X: coordinate.X + ONE_TILE, Y: coordinate.Y};
    }
    if ((orientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.CLOCKWISE)
      || (orientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.COUNTER_CLOCKWISE)) {
      return {X: coordinate.X - ONE_TILE, Y: coordinate.Y};
    }
    if ((orientation === BubbleOrientation.HORIZONTAL_1_LEFT && rotation === RotationDirection.CLOCKWISE)
      || (orientation === BubbleOrientation.HORIZONTAL_1_RIGHT && rotation === RotationDirection.COUNTER_CLOCKWISE)) {
      return {X: coordinate.X, Y: coordinate.Y - ONE_TILE};
    }
    //TODO: Do I actually ever need to use this case? Previously, didn"t because other board pieces weren"t accounted for.
    if ((orientation === BubbleOrientation.HORIZONTAL_1_LEFT && rotation === RotationDirection.COUNTER_CLOCKWISE)
      || (orientation === BubbleOrientation.HORIZONTAL_1_RIGHT && rotation === RotationDirection.CLOCKWISE)) {
      return {X: coordinate.X, Y: coordinate.Y + ONE_TILE};
    }
    return coordinate;
  }

  public static getBubbleTwoCoordinateAfterRotation(bubble1Coordinate: TileCoordinate, newOrientation: BubbleOrientation ): TileCoordinate {
    let coordinate = { X: bubble1Coordinate.X, Y: bubble1Coordinate.Y };
    switch(newOrientation) {
      case BubbleOrientation.VERTICAL_1_TOP:
        coordinate.Y += ONE_TILE;
        break;
      case BubbleOrientation.VERTICAL_1_BOTTOM:
        coordinate.Y -= ONE_TILE;
        break;
      case BubbleOrientation.HORIZONTAL_1_LEFT:
        coordinate.X += ONE_TILE;
        break;
      case BubbleOrientation.HORIZONTAL_1_RIGHT:
        coordinate.X -= ONE_TILE;
        break;
      default:
        throw "Invalid orientation.";
    }

    return coordinate;
  }

  private static getRandomInt(startVal: number, max: number): number {
    return startVal + Math.floor(Math.random() * max);
  }
}
