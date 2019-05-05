import { BubbleOrientation, BUBBLE_HIDDEN_SPAWN_TILE_COORDINATE, BUBBLE_1_STARTING_TILE_COORDINATE, BUBBLE_2_STARTING_TILE_COORDINATE } from "../utils/bubbleUtils";
import { MainScene } from "../scenes/mainScene";
import { BubbleSprite } from "./bubbleSprite";


export class BubbleSpritePair {
  private bubble1: BubbleSprite;
  private bubble2: BubbleSprite;
  private currentOrientation: BubbleOrientation = BubbleOrientation.VERTICAL_1_TOP;

  constructor(mainScene: MainScene) {
    this.bubble1 = new BubbleSprite(mainScene, BUBBLE_HIDDEN_SPAWN_TILE_COORDINATE);
    this.bubble2 = new BubbleSprite(mainScene, BUBBLE_HIDDEN_SPAWN_TILE_COORDINATE);
  }

  public getBubble1(): BubbleSprite {
    return this.bubble1;
  }

  public getBubble2(): BubbleSprite {
    return this.bubble2;
  }

  public getOrientation(): BubbleOrientation {
    return this.currentOrientation;
  }
  
  public setOrientation(newOrientation: BubbleOrientation): void {
    this.currentOrientation = newOrientation;
  }
}
