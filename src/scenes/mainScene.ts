import {
  COORDINATE,
  MAP_BOTTOM_BORDER_TILE_HEIGHT,
  MAP_FULL_TILE_WIDTH,
  MAP_INNER_BOARD_TILE_HEIGHT,
  MapUtils,
  TILE_HEIGHT,
  TILE_WIDTH
} from '../mapUtils';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import Tile = Phaser.Tilemaps.Tile;
import { KeyboardControls } from '../KeyboardControls';
import Image = Phaser.GameObjects.Image;
import { BubbleColorEnum, BubbleUtils } from '../bubbleUtils';


export class MainScene extends Phaser.Scene {
  private keyboardControls: KeyboardControls;
  private dynamicTileMapLayer: DynamicTilemapLayer;
  private staticTileMapLayer: StaticTilemapLayer;
  private activeBubble1: Image;
  private activeBubble2: Image;


  constructor() {
    super({key: "MainScene"});
  }

  preload(): void {
    this.load.image("tile-sheet", "./src/assets/tile-sheet.png");
    this.load.image("tile-bubbles", "./src/assets/bubbles.png");
    this.load.image(BubbleColorEnum.RED.imageName, "./src/assets/bubble-red.png");
    this.load.image(BubbleColorEnum.BLUE.imageName, "./src/assets/bubble-blue.png");
    this.load.image(BubbleColorEnum.PURPLE.imageName, "./src/assets/bubble-purple.png");
    this.load.image(BubbleColorEnum.YELLOW.imageName, "./src/assets/bubble-yellow.png");
    this.load.image(BubbleColorEnum.ORANGE.imageName, "./src/assets/bubble-orange.png");
    this.load.image(BubbleColorEnum.GREEN.imageName, "./src/assets/bubble-green.png");
  }

  create(): void {
    const level2 = MapUtils.generateMap();

    const map = this.make.tilemap({ data: level2, tileWidth: 40, tileHeight: 40 });
    const tiles = map.addTilesetImage("tile-sheet", "tile-sheet", 40, 40);
    const bubbles = map.addTilesetImage("tile-bubbles", "tile-bubbles", 40, 40 );

    this.staticTileMapLayer = map.createStaticLayer(0, tiles, 0, 0);
    //TODO: move in-active bubbles to dynamic map layer
    this.dynamicTileMapLayer = map.createBlankDynamicLayer( null , bubbles, MapUtils.getInnerBoardXIndex(), MapUtils.getInnerBoardYIndex(), MapUtils.getInnerBoardTileWidth(), MapUtils.getInnerBoardTileHeight(), 40, 40);

    // Bottom border
    let borderTiles: Tile[] = this.staticTileMapLayer.getTilesWithin( 0, MAP_INNER_BOARD_TILE_HEIGHT, MAP_FULL_TILE_WIDTH, MAP_BOTTOM_BORDER_TILE_HEIGHT);
    borderTiles.forEach(function(t) {
      t.setCollision(true, true, true, true);
    });

    this.createActiveBubblePair();

    this.physics.collide(this.dynamicTileMapLayer);
    this.physics.collide(this.staticTileMapLayer);
    this.physics.collide(this.activeBubble1);
    this.physics.collide(this.activeBubble2);

    this.keyboardControls =  new KeyboardControls(this);
    this.keyboardControls.bindMovementKeys(this.moveActiveBubble);
    this.keyboardControls.startDownwardMovement(this.moveActiveBubble);
  }

  update(): void {
  }

  moveActiveBubble(vector: COORDINATE): void {
    //TODO: figure out if there is a faster way to move bubbles. SetPosition is based on render speed and may result is missed button presses.
    //TODO: handle collisions dynamic tile map
    //TODO: handle splitting active bubbles when a half dynamic tile collision occurs
    //TODO: handle reset conditions for sprite
    if(MapUtils.isValidXBoundary(this.activeBubble1.x, vector.X) && MapUtils.isValidXBoundary(this.activeBubble2.x, vector.X)
      && MapUtils.isValidYBoundary(this.activeBubble1.y, vector.Y) && MapUtils.isValidYBoundary(this.activeBubble2.y, vector.Y)) {
      this.activeBubble1.setPosition(this.activeBubble1.x + vector.X, this.activeBubble1.y + vector.Y);
      this.activeBubble2.setPosition(this.activeBubble2.x + vector.X, this.activeBubble2.y + vector.Y);
    }
  }

  //TODO: move me somewhere else
  createActiveBubblePair(): void {
    //TODO: figure out why sprites need to offset their start position by half it's width
    //TODO: show next generated bubble pair.
    this.activeBubble1 = this.physics.add.staticImage(MapUtils.getInnerBoardStartingCoordinate().X+(TILE_WIDTH/2), MapUtils.getInnerBoardStartingCoordinate().Y-TILE_HEIGHT-(TILE_HEIGHT/2), BubbleUtils.generateRandomBubbleColorImageName());
    this.activeBubble2 = this.physics.add.staticImage(MapUtils.getInnerBoardStartingCoordinate().X+(TILE_WIDTH/2), MapUtils.getInnerBoardStartingCoordinate().Y-(2*TILE_HEIGHT)-(TILE_HEIGHT/2), BubbleUtils.generateRandomBubbleColorImageName());
  }
}
