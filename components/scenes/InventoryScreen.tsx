import {useWebSocket} from "@/components/WebSocketContext";
import {GameCommands} from "@/lib/utils/GameCommands";
import {useBackButton, useInitData} from "@tma.js/sdk-react";
import {useEffect} from "react";
import {GameplayData} from "@/lib/utils/GameRenderer";
import InventoryItemsList from "@/components/InventoryItemsList";

import "@/assets/inventory.css"

export default function InventoryScreen({inventory}: {inventory: GameplayData["inventory"]}){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const backButton = useBackButton()

  const callback = () => { ws?.send(JSON.stringify({
    action: GameCommands.CHANGE_SCREEN,
    userId: userId,
    payload: {scene: "main"}
  }))}

  backButton.on("click", callback)

  useEffect(() => {
    backButton.show();
  }, [backButton]);

  return <InventoryItemsList items={inventory.items}/>
}
