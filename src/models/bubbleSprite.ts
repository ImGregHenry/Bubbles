import { BubbleUtils } from "../utils/bubbleUtils";
import { MainScene } from "../scenes/mainScene";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { BUBBLE_POSITION_X_OFFSET, BUBBLE_POSITION_Y_OFFSET } from "../utils/mapUtils";

export class BubbleSprite {
  private context: MainScene;
  private bubble: Sprite;
  private color: string;

  constructor(context: MainScene, startX: number, startY: number) {
    this.context = context;
    this.color = BubbleUtils.generateRandomBubbleColorImageName();
    this.bubble = context.physics.add.sprite(startX, startY, this.color);
  }

  getX(): number {
    return this.bubble.x;
  }

  getY(): number {
    return this.bubble.y;
  }

  getColor(): string {
    return this.color;
  }

  getSprite(): Sprite {
    return this.bubble;
  }

  setPosition(pixelX: number, pixelY: number): void {
    this.bubble.setPosition(pixelX, pixelY);
  }

  destroy(): void {
    this.bubble.destroy();
  }
}
