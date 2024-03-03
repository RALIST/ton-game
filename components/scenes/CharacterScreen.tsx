"use client"

import {useWebSocket} from "@/components/WebSocketContext";
import {useBackButton, useInitData} from "@tma.js/sdk-react";
import {GameCommands} from "@/lib/utils/gameCommands";
import {GameplayData} from "@/lib/GameRenderer";
import {useEffect} from "react";

import "@/assets/character.css"
import Attributes from "@/components/Attributes";
import Skills from "@/components/Skills";
import Perks from "@/components/Perks";
import Stats from "@/components/Stats";

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
      <Stats
        currentHealth={character.currentHealth}
        maxHealth={character.maxHealth}
        endurance={character.endurance}
        maxEndurance={character.maxEndurance}/>
      <Attributes attributes={character.attributes}/>
      <Skills skills={character.skills}/>
      <Perks perks={character.perks}/>
    </div>
  )
}
