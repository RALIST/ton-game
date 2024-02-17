import Phaser from "phaser";
import {useEffect, useRef, useState} from "react";

import MainMenu from "@/components/scenes/MainMenu";
import {useMiniApp, useViewport} from "@tma.js/sdk-react";
import GameConfig = Phaser.Types.Core.GameConfig;

export default function Game() {
  let [_, setGame] = useState<Phaser.Game | null>(null);
  const viewport = useViewport();
  const app = useMiniApp();

  useEffect(() => {
      const config: GameConfig = {
        type: Phaser.CANVAS,
        scene: MainMenu,
        width: viewport.width - 10,
        height: viewport.stableHeight - 10,
        parent: "app",
        autoRound: true,
      };

      const newGame = new Phaser.Game(config);
      setGame(newGame);

      app.ready();

      return () => {
        newGame?.destroy(true, true);
        console.log("🐲 DESTROY 🐲");
      };
  }, []);

  return null;
}
