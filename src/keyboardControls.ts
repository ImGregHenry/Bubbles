import { MainScene } from './scenes/mainScene';
import { TileUtils } from './utils/tileUtils';
import CursorKeys = Phaser.Input.Keyboard.CursorKeys;
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;
import TimerEvent = Phaser.Time.TimerEvent;

const BUTTON_HOLD_DEBOUNCE_DELAY = 60;
const BUBBLE_DROP_SPEED = 1050;

export enum RotationDirection {
  COUNTER_CLOCKWISE,
  CLOCKWISE
}

export class KeyboardControls {
  private readonly context: MainScene;
  private cursors: CursorKeys;
  private downwardMovementTimer: TimerEvent;
  private leftKeyRepeatTimer: TimerEvent;
  private rightKeyRepeatTimer: TimerEvent;
  private downKeyRepeatTimer: TimerEvent;
  private isControlsDisabled: boolean = false;

  constructor(context: MainScene) {
    this.context = context;
    this.initKeys();
  }

  private initKeys(): void {
    this.cursors = this.context.input.keyboard.createCursorKeys();

    // Capture key pressed to avoid default browser actions.
    this.context.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.context.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.context.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.UP);
    this.context.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }
  
  startDownwardMovement(downwardCallback: Function): void {
    this.downwardMovementTimer = this.context.time.addEvent({loop: true, delay: BUBBLE_DROP_SPEED, callback: downwardCallback, callbackScope: this.context, args: [TileUtils.MOVE_DOWN_VECTOR]});
  }

  bindMovementKeys(keyPressCallback: Function): void {
    // Left key
    let leftKey = this.context.input.keyboard.addKey(KeyCodes.LEFT);
    leftKey.on('down', function() {
      //TODO: consider using startAt instead of calling directly at start.
      keyPressCallback.apply(this.context, [TileUtils.MOVE_LEFT_VECTOR]);
      this.leftKeyRepeatTimer = this.context.time.addEvent({loop: true,delay: BUTTON_HOLD_DEBOUNCE_DELAY, callback: keyPressCallback, callbackScope: this.context, args: [TileUtils.MOVE_LEFT_VECTOR]});
    }, this);

    leftKey.on('up', function() {
      if (this.leftKeyRepeatTimer) {
        this.leftKeyRepeatTimer.destroy();
      }
    }, this);

    // Right key
    let rightKey = this.context.input.keyboard.addKey(KeyCodes.RIGHT);
    rightKey.on('down', function() {
      keyPressCallback.apply(this.context, [TileUtils.MOVE_RIGHT_VECTOR]);
      this.rightKeyRepeatTimer = this.context.time.addEvent({loop: true, delay: BUTTON_HOLD_DEBOUNCE_DELAY, callback: keyPressCallback, callbackScope: this.context, args: [TileUtils.MOVE_RIGHT_VECTOR]});
    }, this);

    rightKey.on('up', function() {
      if (this.rightKeyRepeatTimer) {
        this.rightKeyRepeatTimer.destroy();
      }
    }, this);

    // Down key
    let downKey = this.context.input.keyboard.addKey(KeyCodes.DOWN);
    downKey.on('down', function() {
      keyPressCallback.apply(this.context, [TileUtils.MOVE_DOWN_VECTOR]);
      this.downKeyRepeatTimer = this.context.time.addEvent({loop: true, delay: BUTTON_HOLD_DEBOUNCE_DELAY, callback: keyPressCallback, callbackScope: this.context, args: [TileUtils.MOVE_DOWN_VECTOR]});
    }, this);

    downKey.on('up', function() {
      if (this.downKeyRepeatTimer) {
        this.downKeyRepeatTimer.destroy();
      }
    }, this);
  }

  bindRotateKeys(rotationKeyCallback: Function): void {
    let leftRotate = this.context.input.keyboard.addKey(KeyCodes.A);
    leftRotate.on('down', function() {
      rotationKeyCallback.apply(this.context, [RotationDirection.COUNTER_CLOCKWISE]);
    }, this);

    let rightRotate = this.context.input.keyboard.addKey(KeyCodes.S);
    rightRotate.on('down', function() {
      rotationKeyCallback.apply(this.context, [RotationDirection.CLOCKWISE]);
    }, this);
  }
}
