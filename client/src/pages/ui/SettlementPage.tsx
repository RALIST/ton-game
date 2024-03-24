import {useWebSocket} from "@/shared";
import {initData} from "@/shared";
import {gameSceneLabels} from "@/shared/enums/GameCommands";
import style from "@/pages/styles/SettlementPage.module.css";

export default function SettlementPage({game}: { game: any}) {
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
        return <div className={style.button} onClick={callback(scene)} key={index}>{gameSceneLabels[scene]}</div>
      })}
    </main>
  );
}
