import "phaser";
import { MainScene } from "./scenes/mainScene";

const config: GameConfig = {
  width: 800,
  height: 720,
  type: Phaser.AUTO,
  parent: "game",
  scene: MainScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 0
      }
    }
  }
};


export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.addEventListener("load", () => {
  var game = new Game(config);
});
