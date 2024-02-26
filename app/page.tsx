'use client';

import {useEffect, useState} from "react";
import MainScreen from "@/components/scenes/MainScreen";
import MapScreen from "@/components/scenes/MapScreen";
import {Gameplay} from "@/lib/Gameplay";
import {useInitData, useViewport} from "@tma.js/sdk-react";
import {useWebSocket} from "@/components/WebSocketContext";
import CharacterScreen from "@/components/scenes/CharacterScreen";
import InventoryScreen from "@/components/scenes/InventoryScreen";

export default function Home() {
  const [game, setGame] = useState<Gameplay | null>(null)
  const ws = useWebSocket()

  // const layout = useViewport();
  // const initData = useInitData();
  // const userId = initData?.user?.id // get telegram id
  const userId = 1
  useEffect(() => {
    // layout.expand()
    // @ts-ignore
    ws.onopen = () => {
      ws?.send(JSON.stringify({action: "init", userId: 1}))
    }

    // @ts-ignore
    ws.onmessage = function (event) {
      const data: Gameplay = JSON.parse(event.data)
      setGame(data)
    }
  }, [ws]);

  if (!game) {
    return <div>Loading...</div>
  } else {
    switch (game.state.currentScene) {
      case "main": {
        return <MainScreen character={game.character}
                           availableActions={game.availableActions}
                           state={game.state}
                           log={game.logger.currentLogs}/>
      }
      case "map": {
        return <MapScreen currentLocation={game.state.currentLocation}/>
      }
      case "character": {
        return <CharacterScreen/>
      }
      case "inventory": {
        return <InventoryScreen/>
      }
    }
  }
};
