import {useWebSocket} from "@/Components/WebSocketContext";
import {initData} from "@/Components/App/App";
import {gameCommandLabels} from "@/shared/enums/GameCommands";
import style from "../Game.module.css";

export default function VillageScene({game}: { game: any}) {
  const ws = useWebSocket()
  const callback = (scene: string) => {
    return () => {
      if (!ws) return () => {}
      ws.send(JSON.stringify({userId: initData.user?.id, action: "change_scene", payload: { scene: scene} }))
    }
  }

  return (
    <main>
      <h1>Settlement</h1>
      {game.availableScenes.map((scene: string, index: number) => {
        return <div className={style.button} onClick={callback(scene)} key={index}>{gameCommandLabels[scene]}</div>
      })}
    </main>
  );
}
