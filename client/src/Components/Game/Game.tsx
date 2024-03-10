import React, {useEffect, useState} from 'react';
import {useWebSocket} from "../WebSocketContext";
import VillageScene from "./Scenes/VillageScene";

const Loading = () => <div>Loading...</div>;

const setupWebSocketListeners = (ws: WebSocket | null, setGame: React.Dispatch<React.SetStateAction<GameplayData | null>>) => {
  if (ws) {
    ws.onopen = () => {
      ws.send('{}'); // ping server
    }
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data)
      setGame(data)
    }
    ws.onclose = () => {
      // close mini app
    }
  }
}

const Game = () => {
  const ws = useWebSocket()
  const [game, setGame] = useState<GameplayData | null>(null)

  useEffect(() => {
    setupWebSocketListeners(ws, setGame);
  }, [ws]);

  if (!game) return <Loading/>

  switch (game.currentScene) {
    case "village_scene": {
      return <VillageScene game={game}/>
    }
    default: {
      return <div>Broken scene</div>
    }
  }
}

export default Game;
