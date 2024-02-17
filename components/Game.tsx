import Phaser from "phaser";
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

  const parentEl = useRef<HTMLDivElement>(null);
  let [game, setGame] = useState<Phaser.Game | null>(null);

  useEffect(() => {
    import('phaser').then(Phaser => {
      if (!parentEl.current) return;

      const config = {
        type: Phaser.AUTO,
        scene: Example,
        width: 400,
        height: 400,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 200 }
          }
        }
      };

      const newGame = new Phaser.Game({ ...config, parent: parentEl.current});
      setGame(newGame);

      return () => {
        newGame?.destroy(true, true);
        console.log("🐲 DESTROY 🐲");
      };
    });
  }, []);

  return (
    <div ref={parentEl}/>
  );
}
