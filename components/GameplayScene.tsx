"use client"

import MainScreen from "@/components/scenes/MainScreen";
import MapScreen from "@/components/scenes/MapScreen";
import CharacterScreen from "@/components/scenes/CharacterScreen";
import InventoryScreen from "@/components/scenes/InventoryScreen";
import {useEffect, useState} from "react";
import {useWebSocket} from "@/components/WebSocketContext";
import {GameplayData} from "@/lib/SceneRenderer";

export default function GameplayScene() {
  const [game, setGame] = useState<GameplayData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const ws = useWebSocket()

  const userId = 1
  useEffect(() => {
    // layout.expand()
    // @ts-ignore
    ws.onopen = () => {
      ws?.send("{}")
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
    switch (game.currentScene) {
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
}
