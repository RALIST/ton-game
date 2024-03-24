import {useEffect, useState} from 'react';
import {initData, useWebSocket} from "@/shared";
import SettlementPage from "@/pages/ui/SettlementPage";
import InventoryPage from "@/pages/ui/InventoryPage";
import Loading from "@/shared/ui/Loading/Loading";
import ShopPage from "@/pages/ui/ShopPage";
import PlayerPage from "@/pages/ui/PlayerPage";
import Header from "@/widgets/ui/Header";
import Footer from "@/widgets/ui/Footer";
import RoutesPage from "@/pages/ui/RoutesPage";

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
    village_scene: <SettlementPage game={game}/>,
    inventory_scene: <InventoryPage game={game}/>,
    shop_scene: <ShopPage/>,
    player_scene: <PlayerPage player={game.currentPlayer}/>,
    routes_scene: <RoutesPage/>,
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
