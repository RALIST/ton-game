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
    const bg = this.add.sprite(200, 350, 'bg');
    bg.scale = 0.7;

    this.add.text(10, 10, "Survivors", {
      fontSize: 32,
      color: "#ffffff"
    });
  }
}
