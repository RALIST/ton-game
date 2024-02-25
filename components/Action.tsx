import {useContext} from "react";
import {WsContext} from "@/app/layout";

export default function Action({type}: {type: string}){
  const ws = useContext(WsContext)
  const callback = () => { ws.send(JSON.stringify({action: type}))}
  function buildAction() {
    switch (type) {
      case "move": {
        return <div className={"button"} onClick={callback}>Идти дальше</div>
      }
      case "look": {
        return <div className={"button"} onClick={callback}>Осмотреться</div>
      }
      case "back": {
        return <div className={"button"} onClick={callback}>Вернуться на базу</div>
      }
      case "attack": {
        return <div className={"button"} onClick={callback}>Атаковать</div>
      }
      case "run": {
        return <div className={"button"} onClick={callback}>Убежать</div>
      }
      default:
        return <div></div>
    }
  }

  return buildAction()
}
