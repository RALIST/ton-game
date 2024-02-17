import Phaser from "phaser";
import {useEffect, useRef, useState} from "react";

type GameProps = {
  name: string | undefined;
}

export default function Game(props: GameProps)
{
  const name = props.name || ""

  class Example extends Phaser.Scene
  {

    constructor() {
      super();
    }

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

      let text = this.add.text(20, 50, name);
      text.setBlendMode(Phaser.BlendModes.ADD);

      this.tweens.add({
        targets: text,
        duration: 4000,
        scaleX: 4,
        ease: 'Quad.easeInOut',
        repeat: -1,
        yoyo: true
      });

      this.tweens.add({
        targets: text,
        duration: 3000,
        scaleY: 8,
        ease: 'Cubic.easeInOut',
        repeat: -1,
        yoyo: true
      });

      particles.startFollow(text);
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
        width: parentEl.current.offsetWidth,
        height: 300,
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
