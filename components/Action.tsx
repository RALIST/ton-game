import {useWebSocket} from "@/components/WebSocketContext";
import {gameCommandLabels} from "@/lib/utils/GameCommands";
import {useInitData} from "@tma.js/sdk-react";

export default function Action({type}: {type: string}){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const callback = () => { ws?.send(JSON.stringify({action: type, userId: userId}))}
  // @ts-ignore
  const buttonLabel = gameCommandLabels[type];
  return buttonLabel ? <div className={"button"} onClick={callback}>{buttonLabel}</div> : <div></div>;
}
