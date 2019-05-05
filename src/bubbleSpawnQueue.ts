import { MainScene } from "./scenes/mainScene";
import { BubbleSpritePair } from "./models/bubbleSpritePair";


const MAX_BUBBLE_QUEUE_SIZE = 5;

export class BubbleSpawnQueue {

  private spawnQueue: BubbleSpritePair[];
  private context: MainScene;
  
  constructor(context: MainScene) {
    this.spawnQueue = [];
    this.context = context;

    this.generateQueue();
  }

  private generateQueue(): void {
    while (this.spawnQueue.length < MAX_BUBBLE_QUEUE_SIZE) {
      this.spawnQueue.push(this.createNewBubbleSpritePair());
    }
  }

  public getNextBubbleSpritePair(): BubbleSpritePair {
    const next: BubbleSpritePair = this.spawnQueue.shift();
    this.generateQueue();
    return next;
  }

  private createNewBubbleSpritePair(): BubbleSpritePair {
    return new BubbleSpritePair(this.context);
  }
  
  public previewNextBubble(index: number) {
    if (this.spawnQueue.length < index) {
      return this.spawnQueue[index];
    }
  }
}
