import Phaser from "phaser";
import {useEffect, useRef, useState} from "react";

import MainMenu from "@/components/scenes/MainMenu";

export default function Game() {
  const parentEl = useRef<HTMLDivElement>(null);
  let [game, setGame] = useState<Phaser.Game | null>(null);

  useEffect(() => {
      if (!parentEl.current) return;

      const config = {
        type: Phaser.CANVAS,
        scene: MainMenu,
        width: 350,
        height: 700,
        parent: parentEl.current,
        antialias: false
      };

      const newGame = new Phaser.Game(config);
      setGame(newGame);

      return () => {
        newGame?.destroy(true, true);
        console.log("🐲 DESTROY 🐲");
      };
  }, []);

  return <div ref={parentEl}/>;
}
