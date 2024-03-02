"use client"

import {useWebSocket} from "@/components/WebSocketContext";
import {useBackButton, useInitData} from "@tma.js/sdk-react";
import {GameCommands} from "@/lib/utils/gameCommands";
import {GameplayData} from "@/lib/GameRenderer";
import {useEffect} from "react";

export default function CharacterScreen({character}: {character: GameplayData["character"]}){
  const ws = useWebSocket()
  const initData = useInitData();
  const userId = initData?.user?.id // get telegram id
  const backButton = useBackButton()
  const callback = () => { ws?.send(JSON.stringify({
    action: GameCommands.CHANGE_SCREEN,
    userId: userId,
    payload: {scene: "main"}
  }))}

  backButton.on("click", callback)

  useEffect(() => {
    backButton.show();
  }, [backButton]);

  return (
    <div className={"character"}>
      <div className={"characterName"}>{character.name}</div>
      <div className={"characterStats"}>
        <div>❤️ {character.currentHealth}/{character.maxHealth}</div>
        <div>⚡ {character.endurance}/{character.maxEndurance}</div>
      </div>
    </div>
  )
}
