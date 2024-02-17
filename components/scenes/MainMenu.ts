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

    const bg = this.add.image(centerX, centerY, 'bg');
    bg.scale = 0.7;
    const rect = this.add.rectangle(centerX, centerY, screen.width, screen.height, 0x000000, 0.3);

    this.add.text(10, 10, "Survivors", {
      fontSize: 32,
      color: "#ffffff"
    });

    const startButton = this.add.text(0, centerY, "Create character", {
      fontSize: 24,
      color: "#ffffff",
      padding: {left: 10, right: 10, top: 10, bottom: 10}
    });
    startButton.setX(centerX - startButton.width / 2)

    startButton.setInteractive().on('pointerdown', function(pointer: any, localX: any, localY: any, event: any){
      // console.log(pointer, localX, localY, event)
    });

    const settingsButton = this.add.text(0, centerY + 50, "Connect wallet", {
      fontSize: 24,
      color: "#ffffff",
      padding: {left: 10, right: 10, top: 10, bottom: 10}
    });
    settingsButton.setX(centerX - settingsButton.width / 2)

    settingsButton.setInteractive().on('pointerdown', function(pointer: any, localX: any, localY: any, event: any){
      // console.log(pointer, localX, localY, event)
    });
  }
}