import Link from "next/link";
import {useWebSocket} from "@/components/WebSocketContext";
import {GameCommands} from "@/lib/utils/gameCommands";
import {useInitData} from "@tma.js/sdk-react";

export default function InventoryScreen(){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  return (
    <div className={"screen"}>
      Not implemented
      <div><Link href={"/"} onClick={() => ws?.send(JSON.stringify({
        action: GameCommands.CHANGE_SCREEN,
        userId: userId,
        payload: {scene: "main"}
      }))}> Back </Link></div>
    </div>
  )
}
