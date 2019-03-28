import { BubbleUtils } from "../utils/bubbleUtils";
import { MainScene } from "../scenes/mainScene";
import Sprite = Phaser.Physics.Arcade.Sprite;
import { MapUtils, TileCoordinate, PixelCoordinate } from "../utils/mapUtils";
import { TileVector } from "./tileVectors";

export class BubbleSprite {
  private context: MainScene;
  private bubble: Sprite;
  private color: string;

  constructor(context: MainScene, startCoordinate: TileCoordinate, color?: string) {
    this.context = context;
    this.color = color != null ? color : BubbleUtils.generateRandomBubbleColorImageName();
    
    let startPixelCoordinate: PixelCoordinate = MapUtils.convertTileCoordinateToWorldMapPixelCoordinate(startCoordinate);
    this.bubble = context.physics.add.sprite(startPixelCoordinate.X, startPixelCoordinate.Y, this.color);
    this.bubble.setOrigin(0, 0);
  }

  getXPixel(): number {
    return this.bubble.x;
  }

  getYPixel(): number {
    return this.bubble.y;
  }

  getPixelCoordinate(): PixelCoordinate {
    return { X: this.getXPixel(), Y: this.getYPixel() };
  }

  getTileCoordinate(): TileCoordinate {
    return { X: this.getXTile(), Y: this.getYTile() };
  }

  getXTile(): number {
    return MapUtils.convertInnerMapXPixelToTileIndex(this.getXPixel());
  }

  getYTile(): number {
    return MapUtils.convertInnerMapYPixelToTileIndex(this.getYPixel());
  }

  getColor(): string {
    return this.color;
  }

  getColorInt(): number {
    return BubbleUtils.convertBubbleColorImageNameToNumValue(this.getColor());
  }

  getSprite(): Sprite {
    return this.bubble;
  }

  moveTileByTileVector(tileVector: TileVector): void {
    this.setTilePosition({ X: this.getXTile() + tileVector.X, Y: this.getYTile() + tileVector.Y });
  }

  setTilePosition(tileCoordinate: TileCoordinate): void {
    let pixelCoordinate: PixelCoordinate = MapUtils.convertTileCoordinateToWorldMapPixelCoordinate(tileCoordinate);
    this.bubble.setPosition(pixelCoordinate.X, pixelCoordinate.Y);
  }

  destroy(): void {
    this.bubble.destroy();
  }
}
