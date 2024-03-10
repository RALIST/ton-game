import {useWebSocket} from "@/components/WebSocketContext";
import {useInitData} from "@tma.js/sdk-react";
import {GameCommands, SceneCommands} from "@lib/utils/GameCommands";

export default function FooterMenu(){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id

  function setScene(scene: string) {
    return () => {
      ws?.send(JSON.stringify({
        userId: userId,
        scene: scene
      }))
    }
  }

  return(
    <div className={"gameFooter"}>
      <div className={"button"} onClick={setScene(SceneCommands.CHARACTER_SCENE)}>Персонаж</div>
      <div className={"button"} onClick={setScene(SceneCommands.INVENTORY_SCENE)}>Инвентарь</div>
    </div>
  )
}
