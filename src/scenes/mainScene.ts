import {
  BUBBLE_POSITION_X_OFFSET, BUBBLE_POSITION_Y_OFFSET,
  Coordinate,
  MAP_BOTTOM_BORDER_TILE_HEIGHT,
  MAP_FULL_TILE_WIDTH,
  MAP_INNER_BOARD_TILE_HEIGHT,
  MapUtils,
  TILE_HEIGHT,
  TILE_WIDTH
} from '../mapUtils';
import { KeyboardControls, RotationDirection } from '../KeyboardControls';
import { BubbleColorEnum, BubbleOrientation, BubbleUtils } from '../bubbleUtils';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import Tile = Phaser.Tilemaps.Tile;
import Image = Phaser.GameObjects.Image;


export class MainScene extends Phaser.Scene {
  private keyboardControls: KeyboardControls;
  private dynamicTileMapLayer: DynamicTilemapLayer;
  private staticTileMapLayer: StaticTilemapLayer;
  private activeBubble1: Image;
  private activeBubble2: Image;
  private currentOrientation: BubbleOrientation = BubbleOrientation.VERTICAL_1_TOP;


  constructor() {
    super({key: "MainScene"});
  }

  preload(): void {
    this.load.image("tile-sheet", "./src/assets/tile-sheet.png");
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

    this.staticTileMapLayer = map.createStaticLayer(0, tiles, 0, 0);
    //TODO: move in-active bubbles to dynamic map layer
    // this.dynamicTileMapLayer = map.createBlankDynamicLayer( null , bubbles, MapUtils.getInnerBoardXIndex(), MapUtils.getInnerBoardYIndex(), MapUtils.getInnerBoardTileWidth(), MapUtils.getInnerBoardTileHeight(), 40, 40);

    // Bottom border
    let borderTiles: Tile[] = this.staticTileMapLayer.getTilesWithin( 0, MAP_INNER_BOARD_TILE_HEIGHT, MAP_FULL_TILE_WIDTH, MAP_BOTTOM_BORDER_TILE_HEIGHT);
    borderTiles.forEach(function(t) {
      t.setCollision(true, true, true, true);
    });

    this.createActiveBubblePair();

    // this.physics.collide(this.dynamicTileMapLayer);
    this.physics.collide(this.staticTileMapLayer);
    this.physics.collide(this.activeBubble1);
    this.physics.collide(this.activeBubble2);

    this.keyboardControls =  new KeyboardControls(this);
    this.keyboardControls.bindMovementKeys(this.moveActiveBubble);
    this.keyboardControls.bindRotateKeys(this.rotateActiveBubble);
    this.keyboardControls.startDownwardMovement(this.moveActiveBubble);
  }

  update(): void {
  }

  moveActiveBubble(vector: Coordinate): void {
    //TODO: figure out if there is a faster way to move bubbles. SetPosition is based on render speed and may result is missed button presses.
    //TODO: handle collisions dynamic tile map
    //TODO: handle splitting active bubbles when a half dynamic tile collision occurs
    //TODO: handle reset conditions for sprite
    if(MapUtils.isValidXBoundaryWithIncrement(this.activeBubble1.x, vector.X) && MapUtils.isValidXBoundaryWithIncrement(this.activeBubble2.x, vector.X)
      && MapUtils.isValidYBoundaryWithIncrement(this.activeBubble1.y, vector.Y) && MapUtils.isValidYBoundaryWithIncrement(this.activeBubble2.y, vector.Y)) {
      this.activeBubble1.setPosition(this.activeBubble1.x + vector.X, this.activeBubble1.y + vector.Y);
      this.activeBubble2.setPosition(this.activeBubble2.x + vector.X, this.activeBubble2.y + vector.Y);
    }
  }



  rotateActiveBubble(rotationDirection: RotationDirection): void {
    let newOrientation = BubbleUtils.changeOrientationByRotation(this.currentOrientation, rotationDirection);

    //TODO: move the other bubble
    let bubble1NewCoordinate: Coordinate = BubbleUtils.getBubble1CoordinateAfterRotation({X: this.activeBubble1.x, Y: this.activeBubble1.y}, this.currentOrientation, rotationDirection);

    // console.log(bubble1NewCoordinate);
    let bubble2NewCoordinate: Coordinate = BubbleUtils.getBubbleTwoCoordinateAfterRotation(bubble1NewCoordinate, newOrientation);
    // console.log(bubble2NewCoordinate);
    this.activeBubble1.setPosition(bubble1NewCoordinate.X, bubble1NewCoordinate.Y);
    this.activeBubble2.setPosition(bubble2NewCoordinate.X, bubble2NewCoordinate.Y);

    this.currentOrientation = newOrientation;
  }


  //TODO: move me somewhere else
  createActiveBubblePair(): void {
    //TODO: figure out why sprites need to offset their start position by half it's width
    //TODO: show next generated bubble pair.
    this.activeBubble1 = this.physics.add.staticImage(MapUtils.getInnerBoardStartingCoordinate().X + BUBBLE_POSITION_X_OFFSET,
        MapUtils.getInnerBoardStartingCoordinate().Y - BUBBLE_POSITION_Y_OFFSET,
        BubbleColorEnum.RED.imageName);
        // BubbleUtils.generateRandomBubbleColorImageName());
    this.activeBubble2 = this.physics.add.staticImage(this.activeBubble1.x, this.activeBubble1.y + TILE_HEIGHT, BubbleUtils.generateRandomBubbleColorImageName());

    this.currentOrientation = BubbleOrientation.VERTICAL_1_TOP;
  }
}
