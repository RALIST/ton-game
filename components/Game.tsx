import Phaser from "phaser";
import {useEffect, useRef, useState} from "react";

import MainMenu from "@/components/scenes/MainMenu";
import {useViewport} from "@tma.js/sdk-react";

export default function Game() {
  const parentEl = useRef<HTMLDivElement>(null);
  let [game, setGame] = useState<Phaser.Game | null>(null);
  const viewport = useViewport();

  useEffect(() => {
      viewport.expand();

      if (!parentEl.current) return;

      const config = {
        type: Phaser.CANVAS,
        scene: MainMenu,
        width: viewport.width || 350,
        height: viewport.height || 700,
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
