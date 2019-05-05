import { MainScene } from "./scenes/mainScene";
import { BubbleSpawnQueue } from "./bubbleSpawnQueue";
import { BubbleSpritePair } from "./models/bubbleSpritePair";
import { BubbleSprite } from "./models/bubbleSprite";
import { BUBBLE_1_STARTING_TILE_COORDINATE, BUBBLE_2_STARTING_TILE_COORDINATE } from "./utils/bubbleUtils";


export class BubbleSpawnManager {

  private context: MainScene;
  private spawnQueue: BubbleSpawnQueue;
  private activeBubbleSpritePair: BubbleSpritePair;
  
  constructor(context: MainScene) {
    this.context = context;
    this.spawnQueue = new BubbleSpawnQueue(context);
  }

  getActiveBubblePair(): BubbleSpritePair {
    return this.activeBubbleSpritePair;
  }

  getActiveBubble1(): BubbleSprite {
    return this.activeBubbleSpritePair.getBubble1();
  }

  getActiveBubble2(): BubbleSprite {
    return this.activeBubbleSpritePair.getBubble2();
  }

  isBubbleActive(): boolean {
    return this.activeBubbleSpritePair != null;
  }

  spawnNewBubble(): BubbleSpritePair {
    this.activeBubbleSpritePair = null;
    this.activeBubbleSpritePair = this.spawnQueue.getNextBubbleSpritePair();
    this.activeBubbleSpritePair.getBubble1().setTilePosition(BUBBLE_1_STARTING_TILE_COORDINATE);
    this.activeBubbleSpritePair.getBubble2().setTilePosition(BUBBLE_2_STARTING_TILE_COORDINATE);
    return this.activeBubbleSpritePair;
  }

  stopActiveBubblePair(): BubbleSpritePair {
    const terminatedBubbleSpritepair: BubbleSpritePair = this.activeBubbleSpritePair;
    this.activeBubbleSpritePair = null;
    return terminatedBubbleSpritepair;
  }
}
