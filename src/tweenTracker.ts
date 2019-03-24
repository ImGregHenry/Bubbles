import { BubbleDropVector, BoardTracker } from "./boardTracker";
import { MainScene } from "./scenes/mainScene";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { TileUtils } from "./tileUtils";
import { MapUtils, Coordinate, TILE_WIDTH, TILE_HEIGHT } from "./mapUtils";

const TWEEN_MS_TIME_PER_TILE = 100;

export class TweenTracker {
  private boardTracker: BoardTracker;
  private context: MainScene;

  constructor(context: MainScene, boardTracker: BoardTracker) {
    this.context = context;
    this.boardTracker = boardTracker;
  }

  startTweens(dropVectors: BubbleDropVector[], callback: Function): void {
    // callback.bind(dropVectors);
    // callback.bind(callback, dropVectors);

    let longestDropIndex: number = this.getLongestTweenVectorIndex(dropVectors);
    for(let i = 0; i < dropVectors.length; i++) {
      let bubbleSprite: Sprite = this.boardTracker.getBubbleSpriteFromBoard(dropVectors[i].start.X, dropVectors[i].start.Y);
      
      let pixelCoordinate: Coordinate = MapUtils.convertTileIndexToWorldMapCoordinate(dropVectors[i].end.X, dropVectors[i].end.Y);

      this.context.tweens.add({
        targets: bubbleSprite,
        x: pixelCoordinate.X + TILE_WIDTH/2,
        y: pixelCoordinate.Y + TILE_HEIGHT/2,
        ease: 'Linear',
        duration: this.calculateTweenDurationInMs(dropVectors[i].end.Y - dropVectors[i].start.Y),
        repeat: 0,
        yoyo: false,
        onComplete: i == longestDropIndex ? this.handleOnCompleteCallback : null,
        onCompleteParams: [callback, this.context, dropVectors],
        onCompleteScope: this.context
      });
    };
  }

  handleOnCompleteCallback(tween: any, sprite: any, callback: Function, context: MainScene, dropVectors: BubbleDropVector[]) {
    callback.apply(context, [dropVectors]);
  }

  calculateTweenDurationInMs(tileCount: number): number {
    return TWEEN_MS_TIME_PER_TILE * tileCount;
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
