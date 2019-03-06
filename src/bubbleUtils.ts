import { Coordinate, MapUtils, TILE_HEIGHT, TILE_WIDTH } from './mapUtils';
import { RotationDirection } from './KeyboardControls';
import { BoardTracker } from './boardTracker';

const TOTAL_BUBBLE_COLORS = 6;
export const DATA_KEY_COLOR_NAME = "COLOR-NAME";

export const BubbleColor = {
  RED: { value: 0, imageName: 'tile-bubble-red' },
  BLUE: { value: 1, imageName: 'tile-bubble-blue' },
  PURPLE: { value: 2, imageName: 'tile-bubble-purple' },
  YELLOW: { value: 3, imageName: 'tile-bubble-yellow' },
  GREEN: { value: 4, imageName: 'tile-bubble-green' },
  ORANGE: { value: 5, imageName: 'tile-bubble-orange' },
};

export enum BubbleOrientation {
  VERTICAL_1_TOP,
  VERTICAL_1_BOTTOM,
  HORIZONTAL_1_LEFT,
  HORIZONTAL_1_RIGHT
}

export interface BubbleCoordinatePair {
  bubble1Coordinate: Coordinate;
  bubble2Coordinate: Coordinate;
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
    let val: number = this.getRandomInt(TOTAL_BUBBLE_COLORS);
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
  public static getCoordinatePairAfterRotation(bubble1StartCoordinate: Coordinate, bubble2StartCoordinate: Coordinate, currentOrientation: BubbleOrientation,
                                                rotationDirection: RotationDirection, boardTracker: BoardTracker): BubbleCoordinatePair {
    let newOrientation: BubbleOrientation = BubbleUtils.changeOrientationByRotation(currentOrientation, rotationDirection);
    let bubble2CoordinatePostRotation: Coordinate = this.getBubbleTwoCoordinateAfterRotation(bubble1StartCoordinate, newOrientation);

    if (this.isValidBubbleCoordinatePair({bubble1Coordinate: bubble1StartCoordinate, bubble2Coordinate: bubble2CoordinatePostRotation}, boardTracker)) {
      return { bubble1Coordinate: bubble1StartCoordinate, bubble2Coordinate: bubble2CoordinatePostRotation };
    }

    let bubble1CoordinatePostAdjustment: Coordinate = this.getBubble1CoordinateAfterInvalidRotation(bubble1StartCoordinate, currentOrientation, rotationDirection);
    let bubble2CoordinatePostAdjustment: Coordinate = this.getBubbleTwoCoordinateAfterRotation(bubble1CoordinatePostAdjustment, newOrientation);

    if (this.isValidBubbleCoordinatePair({bubble1Coordinate: bubble1StartCoordinate, bubble2Coordinate: bubble2CoordinatePostRotation}, boardTracker)) {
      return { bubble1Coordinate: bubble1CoordinatePostAdjustment, bubble2Coordinate: bubble2CoordinatePostAdjustment };
    }

    // Invalid rotation: return null to indicate no rotation occurred.
    return undefined;
  }

  private static isValidBubbleCoordinatePair(bubblePair: BubbleCoordinatePair, boardTracker: BoardTracker): boolean {
    return MapUtils.isValidCoordinateBoundary(bubblePair.bubble1Coordinate) && MapUtils.isValidCoordinateBoundary(bubblePair.bubble2Coordinate)
      && !boardTracker.isTileOccupiedByPixelCoordinate(bubblePair.bubble1Coordinate) && !boardTracker.isTileOccupiedByPixelCoordinate(bubblePair.bubble2Coordinate);
  }

  public static getBubble1CoordinateAfterInvalidRotation(coordinate: Coordinate, orientation: BubbleOrientation, rotation: RotationDirection): Coordinate {
    if ((orientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.COUNTER_CLOCKWISE )
        || (orientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.CLOCKWISE)) {
        return {X: coordinate.X + TILE_WIDTH, Y: coordinate.Y};
    }
    if ((orientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.CLOCKWISE)
      || (orientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.COUNTER_CLOCKWISE)) {
      return {X: coordinate.X - TILE_WIDTH, Y: coordinate.Y};
    }
    if ((orientation === BubbleOrientation.HORIZONTAL_1_LEFT && rotation === RotationDirection.CLOCKWISE)
      || (orientation === BubbleOrientation.HORIZONTAL_1_RIGHT && rotation === RotationDirection.COUNTER_CLOCKWISE)) {
      return {X: coordinate.X, Y: coordinate.Y - TILE_HEIGHT};
    }
    //TODO: Do I actually ever need to use this case? Previously, didn't because other board pieces weren't accounted for.
    if ((orientation === BubbleOrientation.HORIZONTAL_1_LEFT && rotation === RotationDirection.COUNTER_CLOCKWISE)
      || (orientation === BubbleOrientation.HORIZONTAL_1_RIGHT && rotation === RotationDirection.CLOCKWISE)) {
      return {X: coordinate.X, Y: coordinate.Y + TILE_HEIGHT};
    }
    return coordinate;
  }

  public static getBubbleTwoCoordinateAfterRotation(bubble1Coordinate: Coordinate, newOrientation: BubbleOrientation ): Coordinate {
    let coordinate = { X: bubble1Coordinate.X, Y: bubble1Coordinate.Y };
    switch(newOrientation) {
      case BubbleOrientation.VERTICAL_1_TOP:
        coordinate.Y += TILE_HEIGHT;
        break;
      case BubbleOrientation.VERTICAL_1_BOTTOM:
        coordinate.Y -= TILE_HEIGHT;
        break;
      case BubbleOrientation.HORIZONTAL_1_LEFT:
        coordinate.X += TILE_WIDTH;
        break;
      case BubbleOrientation.HORIZONTAL_1_RIGHT:
        coordinate.X -= TILE_WIDTH;
        break;
      default:
        throw "Invalid orientation.";
        break;
    }

    return coordinate;
  }

  private static getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
