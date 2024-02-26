import Link from "next/link";
import {useWebSocket} from "@/components/WebSocketContext";

export default function InventoryScreen(){
  const ws = useWebSocket()
  return (
    <div className={"screen"}>
      Not implemented
      <div><Link href={"/"} onClick={() => ws?.send(JSON.stringify({
        action: "changeScreen",
        payload: {scene: "main"}
      }))}> Back </Link></div>
    </div>
  )
}
