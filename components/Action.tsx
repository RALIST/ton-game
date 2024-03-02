import {useWebSocket} from "@/components/WebSocketContext";
import {GameCommands} from "@/lib/utils/gameCommands";
import {useInitData} from "@tma.js/sdk-react";

export default function Action({type}: {type: string}){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const callback = () => { ws?.send(JSON.stringify({action: type, userId: userId}))}

  function buildAction() {
    switch (type) {
      case GameCommands.MOVE: {
        return <div className={"button"} onClick={callback}>Идти дальше</div>
      }
      case GameCommands.LOOK: {
        return <div className={"button"} onClick={callback}>Осмотреться</div>
      }
      case GameCommands.REST: {
        return <div className={"button"} onClick={callback}>Разбить лагерь</div>
      }
      case GameCommands.ATTACK: {
        return <div className={"button"} onClick={callback}>Атаковать</div>
      }
      case GameCommands.RUN: {
        return <div className={"button"} onClick={callback}>Убежать</div>
      }
      default:
        return <div></div>
    }
  }

  return buildAction()
}
