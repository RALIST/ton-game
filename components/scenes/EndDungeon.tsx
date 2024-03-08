import {useEffect} from "react";
import {useBackButton, useInitData} from "@tma.js/sdk-react";
import {GameCommands, SceneCommands} from "@/lib/utils/GameCommands";
import {useWebSocket} from "@/components/WebSocketContext";

export default function EndDungeon() {
  const backButton = useBackButton()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const ws = useWebSocket()

  const callback = () => {
    ws?.send(JSON.stringify({scene: SceneCommands.VILLAGE_SCENE, userId: userId}))
  }

  useEffect(() => {
    backButton.hide()
  }, [backButton]);

  return <div className={"gameScreen"}>
    <div className={"title"}>Поздравляю, ты прошел маршрут!</div>
    <div>Вот тебе ништяков от поселения</div>
    <div className={"title"}>+ 1000$</div>
    <div>
      <div className={"button"} onClick={callback}>Вернуться в поселение</div>
    </div>
  </div>
}
