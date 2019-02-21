import { Coordinate, MapUtils, TILE_HEIGHT, TILE_WIDTH } from './mapUtils';
import { RotationDirection } from './KeyboardControls';

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

  public static changeOrientationByRotation(currOrientation: BubbleOrientation, rotation: RotationDirection): BubbleOrientation {
    //TODO: find a cool way of managing rotation between orientations.
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

  public static getBubble1CoordinateAfterRotation(coordinate: Coordinate, orientation: BubbleOrientation, rotation: RotationDirection): Coordinate {
    if (MapUtils.isLeftMostInnerBoundaryCoordinate(coordinate)) {
      if ((orientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.COUNTER_CLOCKWISE )
          || (orientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.CLOCKWISE)) {
          return {X: coordinate.X + TILE_WIDTH, Y: coordinate.Y};
        }
    } else if (MapUtils.isRightMostInnerBoundaryCoordinate(coordinate)) {
      if ((orientation === BubbleOrientation.VERTICAL_1_BOTTOM && rotation === RotationDirection.CLOCKWISE)
        || (orientation === BubbleOrientation.VERTICAL_1_TOP && rotation === RotationDirection.COUNTER_CLOCKWISE)) {
        return {X: coordinate.X - TILE_WIDTH, Y: coordinate.Y};
      }
    } else if (MapUtils.isBottomMostInnerBoundaryCoordinate(coordinate)) {
      if ((orientation === BubbleOrientation.HORIZONTAL_1_LEFT && rotation === RotationDirection.CLOCKWISE)
        || (orientation === BubbleOrientation.HORIZONTAL_1_RIGHT && rotation === RotationDirection.COUNTER_CLOCKWISE)) {
        return {X: coordinate.X, Y: coordinate.Y - TILE_HEIGHT};
      }
    }
    return coordinate;
  }

  private static getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
