import { COORDINATE, MapUtils, TILE_HEIGHT, TILE_WIDTH } from './mapUtils';

const TOTAL_BUBBLE_COLORS = 6;
export const BubbleColorEnum = {
  RED: { value: 0, imageName: 'tile-bubble-red' },
  BLUE: { value: 1, imageName: 'tile-bubble-blue' },
  PURPLE: { value: 2, imageName: 'tile-bubble-purple' },
  YELLOW: { value: 3, imageName: 'tile-bubble-yellow' },
  GREEN: { value: 4, imageName: 'tile-bubble-green' },
  ORANGE: { value: 5, imageName: 'tile-bubble-orange' },
};


export class BubblePair {
  private _bubble1Coordinate: COORDINATE;
  private _bubble1Color: number;
  private _bubble2Color: number;
  private _orientation: BUBBLE_ORIENTATION;

  constructor(bubble1Color: number, bubble2Color: number) {
    this._bubble1Color = bubble1Color;
    this._bubble2Color = bubble2Color;
    this._orientation = BUBBLE_ORIENTATION.VERTICAL_1_TOP;
  }

  getBubble1Color(): number {
    return this._bubble1Color;
  }

  getBubble2Color(): number {
    return this._bubble2Color;
  }

  getOrientation(): BUBBLE_ORIENTATION {
    return this._orientation;
  }

  setOrientation(orientation: BUBBLE_ORIENTATION) {
    this._orientation = orientation;
  }

  getBubble1Coordinate(): COORDINATE {
    return this._bubble1Coordinate;
  }

  setBubble1Coordinate(coordinate: COORDINATE) {
    this._bubble1Coordinate = coordinate;
  }

  getBubble2Coordinate(): COORDINATE {
    return BubbleUtils.getBubbleTwoCoordinate(this);
  }
}


export enum BUBBLE_ORIENTATION {
  VERTICAL_1_TOP,
  VERTICAL_2_TOP,
  HORIZONTAL_1_LEFT,
  HORIZONTAL_2_LEFT
}

export class BubbleUtils {

  public static generateRandomBubblePair(): BubblePair {
    let pair: BubblePair = new BubblePair(this.getRandomInt(TOTAL_BUBBLE_COLORS), this.getRandomInt(TOTAL_BUBBLE_COLORS));
    pair.setBubble1Coordinate(MapUtils.getInnerBoardStartingCoordinate());
    return pair;
  }

  public static generateRandomBubbleColorImageName(): string {
    let val: number = this.getRandomInt(TOTAL_BUBBLE_COLORS);
    switch(val) {
      case BubbleColorEnum.BLUE.value:
        return BubbleColorEnum.BLUE.imageName;
      case BubbleColorEnum.RED.value:
        return BubbleColorEnum.RED.imageName;
      case BubbleColorEnum.GREEN.value:
        return BubbleColorEnum.GREEN.imageName;
      case BubbleColorEnum.YELLOW.value:
        return BubbleColorEnum.YELLOW.imageName;
      case BubbleColorEnum.ORANGE.value:
        return BubbleColorEnum.ORANGE.imageName;
      case BubbleColorEnum.PURPLE.value:
        return BubbleColorEnum.PURPLE.imageName;
      default:
        throw "Invalid bubble color."
    }
  }

  public static getBubbleTwoCoordinate(pair: BubblePair): COORDINATE {
    let coordinate = { X: pair.getBubble1Coordinate().X, Y: pair.getBubble1Coordinate().Y };
    switch(pair.getOrientation()) {
      case BUBBLE_ORIENTATION.VERTICAL_1_TOP:
        coordinate.Y += TILE_HEIGHT;
        break;
      case BUBBLE_ORIENTATION.VERTICAL_2_TOP:
        coordinate.Y -= TILE_HEIGHT;
        break;
      case BUBBLE_ORIENTATION.HORIZONTAL_1_LEFT:
        coordinate.X += TILE_WIDTH;
        break;
      case BUBBLE_ORIENTATION.HORIZONTAL_2_LEFT:
        coordinate.X += TILE_WIDTH;
        break;
      default:
        throw 'Invalid orientation';
        break;
    }

    return coordinate;
  }

  private static getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
