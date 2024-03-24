import React, {useEffect, useState} from 'react';
import {useWebSocket} from "../WebSocketContext";
import VillageScene from "./Scenes/VillageScene";
import InventoryScene from "./Scenes/InventoryScene";
import Loading from "@/shared/Loading/Loading";
import {initData} from "@/Components/App/App";
import ShopScene from "./Scenes/ShopScene";
import PlayerScene from "./Scenes/PlayerScene";
import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";

const setupWebSocketListeners = (ws: WebSocket | null, setGame: React.Dispatch<React.SetStateAction<{} | null>>) => {
  if (!ws) return

    ws.onopen = () => {
      ws.send(JSON.stringify(initData)); // send init user data
    }

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data)
      setGame(data)
    }

    ws.onclose = () => {
      ws.close()
      // close mini app
    }
  }


const Game = () => {
  const ws = useWebSocket()
  const [game, setGame] = useState<any | null>(null)

  useEffect(() => {
    setupWebSocketListeners(ws, setGame);
  }, []);

  if (!game) return <Loading/>
  let currentScene;

  console.log(game)
  switch (game.currentScene) {
    case "village_scene": {
      currentScene = <VillageScene game={game}/>
      break;
    }
    case "inventory_scene": {
      currentScene =  <InventoryScene game={game}/>
      break;
    }
    case "shop_scene": {
      currentScene = <ShopScene/>
      break;
    }
    case "player_scene": {
      currentScene = <PlayerScene player={game.currentPlayer}/>
      break;
    }
    default: {
      currentScene = <div>Invalid scene</div>
    }
  }

  return(
    <div className='app'>
      <Header character={game.currentPlayer}/>
      {currentScene}
      <Footer game={game}/>
    </div>
  )
}

export default Game;
