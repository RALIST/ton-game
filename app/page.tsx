'use client';

import {useEffect, useState} from "react";
import MainScreen from "@/components/scenes/MainScreen";
import MapScreen from "@/components/scenes/MapScreen";
import {Gameplay, GameplayData} from "@/lib/Gameplay";
import {useInitData, useViewport} from "@tma.js/sdk-react";
import {useWebSocket} from "@/components/WebSocketContext";
import CharacterScreen from "@/components/scenes/CharacterScreen";
import InventoryScreen from "@/components/scenes/InventoryScreen";

export default function Home() {
  const [game, setGame] = useState<GameplayData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const ws = useWebSocket()

  // const layout = useViewport();
  // const initData = useInitData();
  // const userId = initData?.user?.id // get telegram id
  const userId = 1
  useEffect(() => {
    // layout.expand()
    // @ts-ignore
    ws.onopen = () => {
      ws?.send(JSON.stringify({action: "init", userId: userId}))
    }

    // @ts-ignore
    ws.onmessage = function (event) {
      const data: GameplayData = JSON.parse(event.data)

      if (data.error) {
        setError(data.error)
        return
      }

      setGame(data)
    }
  }, [ws]);

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!game) {
    return <div>Loading...</div>
  } else {
    switch (game.state.currentScene) {
      case "main": {
        return <MainScreen game={game}/>
      }
      case "map": {
        return <MapScreen currentLocation={game.currentLocation}/>
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
