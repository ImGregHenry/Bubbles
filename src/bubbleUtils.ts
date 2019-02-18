import { COORDINATE, MapUtils, TILE_HEIGHT, TILE_WIDTH } from './mapUtils';

//TODO: find better way to enumerate these
const BUBBLE_RED = 0;
const BUBBLE_BLUE = 1;
const BUBBLE_PURPLE = 2;
const BUBBLE_YELLOW = 3;
const BUBBLE_GREEN = 4;
const BUBBLE_ORANGE = 5;

const TOTAL_BUBBLE_COLORS = 6;

export const BUBBLE_FALL_NORMAL_SPEED = 20;
export const BUBBLE_FALL_ACCELERATED_SPEED = 800;

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
