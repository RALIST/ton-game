import {useEffect, useState} from 'react';
import {useWebSocket} from "../WebSocketContext";
import VillageScene from "./Scenes/VillageScene";
import InventoryScene from "./Scenes/InventoryScene";
import Loading from "@/shared/Loading/Loading";
import {initData} from "@/Components/App/App";
import ShopScene from "./Scenes/ShopScene";
import PlayerScene from "./Scenes/PlayerScene";
import Header from "./Header/Header.tsx";
import Footer from "./Footer/Footer.tsx";
import RoutesScene from "@/Components/Game/Scenes/RoutesScene.tsx";

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

  const sceneComponentsMap: {[key: string]: JSX.Element} = {
    village_scene: <VillageScene game={game}/>,
    inventory_scene: <InventoryScene game={game}/>,
    shop_scene: <ShopScene/>,
    player_scene: <PlayerScene player={game.currentPlayer}/>,
    routes_scene: <RoutesScene/>,
    default: <div>Invalid scene</div>,
  };

  const currentScene = sceneComponentsMap[game.currentScene] || sceneComponentsMap.default;
  console.log(game)

  return (
    <div className='app'>
      <Header character={game.currentPlayer}/>
      {currentScene}
      <Footer game={game}/>
    </div>
  )
}

export default Game;
