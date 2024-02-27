import {useWebSocket} from "@/components/WebSocketContext";
import {GameCommands} from "@/lib/utils/enums";

export default function Action({type}: {type: string}){
  const ws = useWebSocket()
  const callback = () => { ws?.send(JSON.stringify({action: type, userId: 1}))}

  function buildAction() {
    switch (type) {
      case GameCommands.MOVE: {
        return <div className={"button"} onClick={callback}>Идти дальше</div>
      }
      case GameCommands.LOOK: {
        return <div className={"button"} onClick={callback}>Осмотреться</div>
      }
      case GameCommands.BACK: {
        return <div className={"button"} onClick={callback}>Вернуться на базу</div>
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
