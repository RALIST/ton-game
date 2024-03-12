import style from "../Game.module.css";
import {gameCommandLabels} from "../../../enums/GameCommands";
import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {GameplayData} from "../../../types/gameplay";
import {useWebSocket} from "../../WebSocketContext";
import { initData } from "../../App/App"

export default function VillageScene({game}: { game: GameplayData}) {
  const ws = useWebSocket()

  const callback = (scene: string) => {
    return () => {
      if (!ws) return () => {}
      ws.send(JSON.stringify({userId: initData.user?.id, action: "change_scene", payload: { scene: scene} }))
    }
  }

  return (
    <div className={style.game}>
      <Header character={game.character}/>
      <main className={style.main}>
        {game.availableActions.map((action, index) => {
          // @ts-ignore
          return <div key={index}>{gameCommandLabels[action]}</div>
        } )}

        {game.availableScenes.map((scene, index) => {
          // @ts-ignore
          return <a href={"#"} onClick={callback(scene)} key={index}>{gameCommandLabels[scene]}</a>
        } )}
      </main>
      <Footer />
    </div>
  );
}
