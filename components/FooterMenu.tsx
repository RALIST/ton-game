import {useWebSocket} from "@/components/WebSocketContext";
import {useInitData} from "@tma.js/sdk-react";
import {GameCommands} from "@/lib/utils/gameCommands";

export default function FooterMenu(){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id

  function setScene(scene: string) {
    return () => {
      ws?.send(JSON.stringify({
        action: GameCommands.CHANGE_SCREEN,
        userId: userId,
        payload: { scene: scene }}))
    }
  }

  return(
    <div className={"gameFooter"}>
      <div className={"button"} onClick={setScene("character")}>Персонаж</div>
      <div className={"button"} onClick={setScene("inventory")}>Инвентарь</div>
      <div className={"button"} onClick={setScene("map")}>Карта</div>
    </div>
  )
}
