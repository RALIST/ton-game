import Phaser from "phaser";
import {useEffect, useRef, useState} from "react";

import MainMenu from "@/components/scenes/MainMenu";
import {useMiniApp, useViewport} from "@tma.js/sdk-react";

export default function Game() {
  const parentEl = useRef<HTMLDivElement>(null);
  let [_, setGame] = useState<Phaser.Game | null>(null);
  const viewport = useViewport();
  const app = useMiniApp();

  useEffect(() => {
      if (!parentEl.current) return;

      const config = {
        type: Phaser.CANVAS,
        scene: MainMenu,
        parent: parentEl.current
      };

      const newGame = new Phaser.Game(config);
      setGame(newGame);

      app.ready();

      return () => {
        newGame?.destroy(true, true);
        console.log("🐲 DESTROY 🐲");
      };
  }, []);

  return <div ref={parentEl}/>;
}
