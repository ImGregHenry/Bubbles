import {
  COORDINATE,
  MAP_BOTTOM_BORDER_TILE_HEIGHT,
  MAP_FULL_TILE_HEIGHT,
  MAP_FULL_TILE_WIDTH, MAP_INNER_BOARD_MAX_PIXEL, MAP_INNER_BOARD_TILE_HEIGHT,
  MAP_INNER_BOARD_TILE_WIDTH,
  MAP_LEFT_BORDER_TILE_WIDTH,
  MAP_RIGHT_BORDER_STARTING_TILE_WIDTH,
  MAP_RIGHT_BORDER_TILE_WIDTH,
  MapUtils,
  TILE_HEIGHT,
  TILE_WIDTH
} from '../mapUtils';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import { BUBBLE_FALL_NORMAL_SPEED, BubblePair, BubbleUtils } from '../bubbleUtils';
import Image = Phaser.Physics.Arcade.Image;
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import Tile = Phaser.Tilemaps.Tile;
import Sprite = Phaser.Physics.Arcade.Sprite;


export class MainScene extends Phaser.Scene {
  private dynamicTileMapLayer: DynamicTilemapLayer;
  private staticTileMapLayer: StaticTilemapLayer;
  private activeBubble1: Sprite;
  private activeBubble2: Sprite;
  private debounce = 2000;

  constructor() {
    super({key: "MainScene"});
  }

  preload(): void {
    this.load.image("tile-sheet", "./src/assets/tile-sheet.png");
    this.load.image("tile-bubbles", "./src/assets/bubbles.png");
    this.load.image("tile-bubble-red", "./src/assets/bubble-red.png");
    this.load.image("tile-bubble-blue", "./src/assets/bubble-blue.png");
  }

  create(): void {
    const level2 = MapUtils.generateMap();

    const map = this.make.tilemap({ data: level2, tileWidth: 40, tileHeight: 40 });
    const tiles = map.addTilesetImage("tile-sheet", "tile-sheet", 40, 40);
    const bubbles = map.addTilesetImage("tile-bubbles", "tile-bubbles", 40, 40 );

    this.staticTileMapLayer = map.createStaticLayer(0, tiles, 0, 0);
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
  }

  update(): void {
    let cursors = this.input.keyboard.createCursorKeys();

    if ( cursors.space.isDown || cursors.down.isDown ) {
      this.activeBubble1.setVelocity(0, 800);
      this.activeBubble2.setVelocity(0, 800);
    } else {
      this.activeBubble1.setVelocity(0, BUBBLE_FALL_NORMAL_SPEED);
      this.activeBubble2.setVelocity(0, BUBBLE_FALL_NORMAL_SPEED);
    }

    // Left movement
    if (MapUtils.isValidXBoundary(this.activeBubble1.x, -TILE_WIDTH) && MapUtils.isValidXBoundary(this.activeBubble2.x, -TILE_WIDTH)
      && (Phaser.Input.Keyboard.JustDown(cursors.left) || Phaser.Input.Keyboard.DownDuration(cursors.left, this.debounce ))) {
      this.activeBubble1.setPosition(this.activeBubble1.x-TILE_WIDTH, this.activeBubble1.y);
      this.activeBubble2.setPosition(this.activeBubble2.x-TILE_WIDTH, this.activeBubble2.y);
    }

    // Right movement
    if (MapUtils.isValidXBoundary(this.activeBubble1.x, TILE_WIDTH ) && MapUtils.isValidXBoundary(this.activeBubble2.x, TILE_WIDTH)
      && (Phaser.Input.Keyboard.JustDown(cursors.right) || Phaser.Input.Keyboard.DownDuration(cursors.right, this.debounce))) {
      this.activeBubble1.setPosition(this.activeBubble1.x+TILE_WIDTH, this.activeBubble1.y);
      this.activeBubble2.setPosition(this.activeBubble2.x+TILE_WIDTH, this.activeBubble2.y);
    }

    // Capture key pressed to avoid default browser actions.
    this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.UP);
    this.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  //TODO: move me somewhere else
  createActiveBubblePair(): void {
    // TODO: figure out why sprites need to offset their start position by half it's width
    this.activeBubble1 = this.physics.add.sprite(MapUtils.getInnerBoardStartingCoordinate().X+(TILE_WIDTH/2), MapUtils.getInnerBoardStartingCoordinate().Y-TILE_HEIGHT, "tile-bubble-red");
    this.activeBubble1.setVelocity(0, BUBBLE_FALL_NORMAL_SPEED);

    this.activeBubble2 = this.physics.add.sprite(MapUtils.getInnerBoardStartingCoordinate().X+(TILE_WIDTH/2), MapUtils.getInnerBoardStartingCoordinate().Y-(2*TILE_HEIGHT), "tile-bubble-blue");
    this.activeBubble2.setVelocity(0, BUBBLE_FALL_NORMAL_SPEED);

    this.physics.add.collider(this.activeBubble1, this.staticTileMapLayer, this.collision2, null, this);
    this.physics.add.collider(this.activeBubble2, this.staticTileMapLayer, this.collision1, null, this);
  }

  collision2(): void {
    this.activeBubble1.disableBody(true);
    this.activeBubble2.disableBody(true);
  }
  collision1(): void {
    this.activeBubble1.disableBody(true);
    this.activeBubble2.disableBody(true);
  }
}
