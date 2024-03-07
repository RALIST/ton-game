"use client"

import Village from "@/components/scenes/Village";
import Character from "@/components/scenes/Character";
import Inventory from "@/components/scenes/Inventory";
import {useEffect, useState} from "react";
import {useWebSocket} from "@/components/WebSocketContext";
import {GameplayData} from "@/lib/utils/GameRenderer";
import {useBackButton, useInitData, useViewport} from "@tma.js/sdk-react";
import Shop from "@/components/scenes/Shop";
import Bar from "@/components/scenes/Bar";
import Warehouse from "@/components/scenes/Warehouse";
import Home from "@/components/scenes/Home"
import StartDungeon from "@/components/scenes/StartDungeon";
import Bank from "@/components/scenes/Bank";
import {SceneCommands} from "@/lib/utils/GameCommands";
import Dungeon from "@/components/scenes/Dungeon";

export default function GameplayScene() {
  const [game, setGame] = useState<GameplayData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const ws = useWebSocket()
  const viewport = useViewport()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const backButton = useBackButton()

  useEffect(() => {
    viewport.expand();
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

    const callback = () => { ws?.send(JSON.stringify({
      userId: userId,
      scene: SceneCommands.VILLAGE_SCENE
    }))}

    backButton.on("click", callback)
  }, [backButton, viewport, ws]);

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!game) {
    return <div>Loading...</div>
  }

  const scenes: any = {
    [SceneCommands.VILLAGE_SCENE]:  <Village game={game}/>,
    [SceneCommands.CHARACTER_SCENE]: <Character character={game.character}/>,
    [SceneCommands.INVENTORY_SCENE]: <Inventory inventory={game.inventory}/>,
    [SceneCommands.SHOP_SCENE]: <Shop shop={game.shop} balance={game.character?.balance || 0}/>,
    [SceneCommands.BAR_SCENE]: <Bar/>,
    [SceneCommands.HOME_SCENE]: <Home/>,
    [SceneCommands.WAREHOUSE_SCENE]: <Warehouse/>,
    [SceneCommands.START_DUNGEON_SCENE]: <StartDungeon/>,
    [SceneCommands.BANK_SCENE]: <Bank/>,
    [SceneCommands.DUNGEON_SCENE]: <Dungeon game={game}/>
  }

  return scenes[game.currentScene]

}
