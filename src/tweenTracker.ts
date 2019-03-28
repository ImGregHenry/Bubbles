import { BubbleDropVector, BoardTracker } from "./boardTracker";
import { MainScene } from "./scenes/mainScene";
import { MapUtils, TILE_WIDTH, TILE_HEIGHT, PixelCoordinate } from "./utils/mapUtils";
import { BubbleSprite } from "./models/bubbleSprite";
import { Board } from "./models/board";

const TWEEN_TIME_PER_TILE_MS = 120;
const DELAY_AFTER_TWEEN_MS = 500;

export class TweenTracker {
  private board: Board;
  private context: MainScene;

  constructor(context: MainScene, board: Board) {
    this.context = context;
    this.board = board;
  }

  startTweens(dropVectors: BubbleDropVector[], callback: Function): void {
    let longestDropIndex: number = this.getLongestTweenVectorIndex(dropVectors);
    for(let i = 0; i < dropVectors.length; i++) {
      let bubbleSprite: BubbleSprite = this.board.get(dropVectors[i].start);
      
      //TODO: drop vectors should be proper vectors instead of start/end coordinates.
      let pixelCoordinate: PixelCoordinate = MapUtils.convertTileCoordinateToWorldMapPixelCoordinate(dropVectors[i].end);
      this.context.tweens.add({
        targets: bubbleSprite.getSprite(),
        x: pixelCoordinate.X,
        y: pixelCoordinate.Y,
        ease: "Linear",
        duration: this.calculateTweenDurationInMs(dropVectors[i].end.Y - dropVectors[i].start.Y),
        onComplete: i == longestDropIndex ? this.handleTweenOnCompleteCallback : null,
        onCompleteParams: [callback, this.context, dropVectors],
        onCompleteScope: this.context
      });
    };
  }

  handleTweenOnCompleteCallback(tween: any, sprite: any, callback: Function, context: MainScene, dropVectors: BubbleDropVector[]) {
    //TODO: add a delay here for the callback.
    // context.time.delayedCall(DELAY_AFTER_TWEEN_MS, callback, [dropVectors], context);
    callback.apply(context, [dropVectors]);
  }

  calculateTweenDurationInMs(tileCount: number): number {
    return TWEEN_TIME_PER_TILE_MS * tileCount;
  }

  getLongestTweenVectorIndex(dropVectors: BubbleDropVector[]): number {
    let max: number = dropVectors[0].start.Y - dropVectors[0].end.Y;
    let index: number = 0;
    for(let i = 1; i < dropVectors.length; i++) {
      let diff: number = dropVectors[i].start.Y - dropVectors[i].end.Y;
      if (diff > max) {
        index = i;
        max = diff;
      }
    }
    return index;
  }
}
