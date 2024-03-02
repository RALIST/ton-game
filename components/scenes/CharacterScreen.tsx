"use client"
import Link from "next/link";
import {useWebSocket} from "@/components/WebSocketContext";
import {useInitData} from "@tma.js/sdk-react";
import {GameCommands} from "@/lib/utils/gameCommands";
import {GameLocation} from "@/lib/GameLocation";
import {GameplayData} from "@/lib/GameRenderer";

export default function CharacterScreen({character}: {character: GameplayData["character"]}){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const callback = () => { ws?.send(JSON.stringify({
    action: GameCommands.CHANGE_SCREEN,
    userId: userId,
    payload: {scene: "main"}
  }))}

  return (
    <div className={"screen"}>
      <div className={"character"}>
        <div className={"characterName"}>{character.name}</div>
        <div className={"characterStats"}>
          <div>❤️ {character.currentHealth}/{character.maxHealth}</div>
          <div>⚡ {character.endurance}/{character.maxEndurance}</div>
        </div>
      </div>
      <div>
        <Link href={"/"} onClick={callback}>Back</Link>
      </div>
    </div>
  )
}
