import {useEffect} from "react";
import {useBackButton, useInitData} from "@tma.js/sdk-react";
import {GameCommands} from "@/lib/utils/GameCommands";
import {useWebSocket} from "@/components/WebSocketContext";

export default function StartDungeon () {
  const backButton = useBackButton()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const ws = useWebSocket()

  const callback = () => {
    ws?.send(JSON.stringify({action: GameCommands.START_DUNGEON, userId: userId}))
  }

  useEffect(() => {
    backButton.show()
  }, [backButton]);

  return <div className={"gameScreen"}>
    <div className={"title"}>Dungeon</div>
    <div>
      <div className={"button"} onClick={callback}>Отправится в вылазку</div>
    </div>
  </div>
}
