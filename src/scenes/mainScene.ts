import { MapUtils } from "../utils/mapUtils";
import { KeyboardControls, RotationDirection } from "../keyboardControls";
import { BubbleColor } from "../utils/bubbleUtils";
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import { BoardTracker, BubbleDropVector } from "../boardTracker";
import { TweenTracker } from "../tweenTracker";
import { BubbleSpritePair } from "../models/bubbleSpritePair";
import { BubblePopper } from "../actions/bubblePop";
import { TileVector } from "../models/tileVectors";
import { logMessageAndVariable } from "../utils/debugUtils";
import { BubbleSpawnManager } from "../bubbleSpawnManager";


export class MainScene extends Phaser.Scene {
  private keyboardControls: KeyboardControls;
  private boardTracker: BoardTracker;
  private tweenTracker: TweenTracker;
  private bubbleSpawnManager: BubbleSpawnManager;
  private staticTileMapLayer: StaticTilemapLayer;
  private isPaused: boolean = false;
  
  constructor() {
    super({key: "MainScene"});
  }

  preload(): void {
    this.load.image("tile-sheet", "./src/assets/tile-sheet.png");
    this.load.image("tile-bubble-sheet", "./src/assets/tile-bubble-sheet.png");
    this.load.image(BubbleColor.RED.imageName, "./src/assets/bubble-red.png");
    this.load.image(BubbleColor.BLUE.imageName, "./src/assets/bubble-blue.png");
    this.load.image(BubbleColor.PURPLE.imageName, "./src/assets/bubble-purple.png");
    this.load.image(BubbleColor.YELLOW.imageName, "./src/assets/bubble-yellow.png");
    this.load.image(BubbleColor.ORANGE.imageName, "./src/assets/bubble-orange.png");
    this.load.image(BubbleColor.GREEN.imageName, "./src/assets/bubble-green.png");
    this.load.image(BubbleColor.GREEN.imageName, "./src/assets/bubble-green.png");
  }

  create(): void {
    const boardJson = MapUtils.generateBackgroundMap();

    const map = this.make.tilemap({ data: boardJson, tileWidth: 40, tileHeight: 40 });
    const tiles = map.addTilesetImage("tile-sheet", "tile-sheet", 40, 40);

    this.staticTileMapLayer = map.createStaticLayer(0, tiles, 0, 0);

    this.keyboardControls =  new KeyboardControls(this);
    this.keyboardControls.bindMovementKeys(this.moveActiveBubble);
    this.keyboardControls.bindRotateKeys(this.rotateActiveBubble);
    this.keyboardControls.startDownwardMovement(this.moveActiveBubble);

    this.bubbleSpawnManager = new BubbleSpawnManager(this);
    this.boardTracker = new BoardTracker(this, this.bubbleSpawnManager);
    this.tweenTracker = new TweenTracker(this, this.boardTracker.getBoard());
  }

  update(): void {
    if (!this.bubbleSpawnManager.isBubbleActive() && !this.tweenTracker.isDropTweenInProgress()) {
      this.bubbleSpawnManager.spawnNewBubble();
    }
  }

  moveActiveBubble(vector: TileVector): void {
    if (this.getIsPaused()) {
      return;
    }
    this.boardTracker.moveActiveBubble(vector);
  }
  
  rotateActiveBubble(rotationDirection: RotationDirection): void {
    if (this.getIsPaused()) {
      return;
    }
    this.boardTracker.rotateActiveBubble(rotationDirection);
  }

  bubbleDropPopLoop(): void {
    //TODO: disable movement
    this.setPaused(true);
    
    let dropVectors: BubbleDropVector[] = this.boardTracker.calculateBubbleDropVectors();
    if (dropVectors && dropVectors.length > 0) {
      this.tweenTracker.startTweens(dropVectors, this.tweenDropComplete);
    } else {
      this.popBubbles();
    }
  }

  tweenDropComplete(dropVectors: BubbleDropVector[]): void {
    this.boardTracker.updateTileLocationsAfterDrops(dropVectors);
    this.popBubbles();
  }

  popBubbles(): void {
    let isBubblePopped: boolean = BubblePopper.popBubbles(this.boardTracker.getBoard());
      if (isBubblePopped) {
        this.bubbleDropPopLoop();
      } else {
        this.boardTracker.spawnActiveBubblePair();

        //TODO: re-enable movement. 
        this.setPaused(false);
      }
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  setPaused(setPaused: boolean): void {
    this.isPaused = setPaused;
  }
}
