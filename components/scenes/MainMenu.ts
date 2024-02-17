import Phaser from "phaser";

export default class MainMenu extends Phaser.Scene
{
  constructor() {
    super();
  }

  preload () {
    const idx = Math.floor(Math.random() * 56);
    this.load.image("bg", `assets/bg/Apocalypse_${idx}.png`);
  }

  create () {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(10, 10, "Survivors", {
      fontSize: 32,
      color: "#000000"
    });

    const startButton = this.add.text(0, centerY, "Create character", {
      fontSize: 24,
      color: "#000000",
      padding: {left: 10, right: 10, top: 10, bottom: 10}
    });
    startButton.setX(centerX - startButton.width / 2)

    startButton.setInteractive().on('pointerdown', function(pointer: any, localX: any, localY: any, event: any){
      // console.log(pointer, localX, localY, event)
    });

    const settingsButton = this.add.text(0, centerY + 50, "Connect wallet", {
      fontSize: 24,
      color: "#000000",
      padding: {left: 10, right: 10, top: 10, bottom: 10}
    });
    settingsButton.setX(centerX - settingsButton.width / 2)

    settingsButton.setInteractive().on('pointerdown', function(pointer: any, localX: any, localY: any, event: any){
      // console.log(pointer, localX, localY, event)
    });
  }
}
