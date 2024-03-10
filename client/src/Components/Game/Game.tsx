import React, {useEffect, useState} from 'react';
import Energy from './Energy/Energy';
import style from './Game.module.css';
import {useWebSocket} from "../WebSocketContext";
import {gameCommandLabels} from "../../enums/GameCommands";
import VillageScene from "./scenes/VillageScene";

const Game = () => {
  const ws = useWebSocket()
  const [game, setGame] = useState<GameplayData | null>(null)

  useEffect(() => {
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
  });

  if (!game) return <div>Loading...</div>
  switch(game.currentScene) {
    case "village_scene": {
      return <VillageScene game={game}/>
    }
    default: {
      return <div>Broken scene</div>
    }
  }
}



export default Game;
