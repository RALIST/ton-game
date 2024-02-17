import {Game as PhaserGame } from "phaser";
import {useEffect, useRef, useState} from "react";

export default function Game() {
  class Example extends Phaser.Scene
  {
    preload ()
    {
      this.load.setBaseURL('https://labs.phaser.io');

      this.load.image('sky', 'assets/skies/space3.png');
      this.load.image('logo', 'assets/sprites/phaser3-logo.png');
      this.load.image('red', 'assets/particles/red.png');
    }

    create ()
    {
      this.add.image(400, 300, 'sky');

      const particles = this.add.particles(0, 0, 'red', {
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
      });

      const logo = this.physics.add.image(400, 100, 'logo');

      logo.setVelocity(100, 200);
      logo.setBounce(1, 1);
      logo.setCollideWorldBounds(true);

      particles.startFollow(logo);
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    }
  };
  const parentEl = useRef<HTMLDivElement>(null);

  let [game, setGame] = useState<PhaserGame | null>(null);

  useEffect(() => {
    if (!parentEl.current) return;

    const newGame = new PhaserGame({ ...config, parent: parentEl.current, width: parentEl.current.offsetWidth, height: parentEl.current.offsetHeight });
    setGame(newGame);

    return () => {
      newGame?.destroy(true, true);
      console.log("🐲 DESTROY 🐲");
    };
  }, []);

  return (
    <div ref={parentEl}/>
  );
}
