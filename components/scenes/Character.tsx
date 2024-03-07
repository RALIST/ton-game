"use client"

import {useBackButton} from "@tma.js/sdk-react";
import {GameplayData} from "@/lib/utils/GameRenderer";
import {useEffect} from "react";

import "@/assets/character.css"
import Attributes from "@/components/Attributes";
import Skills from "@/components/Skills";
import Perks from "@/components/Perks";
import Stats from "@/components/Stats";

export default function Character({character}: {character: GameplayData["character"] | undefined}){
  const backButton = useBackButton()
  useEffect(() => {
    backButton.show();
  }, [backButton]);

  if(!character) {
    return <div>Something went wrong.</div>
  }

  return (
    <div className={"character"}>
      <div className={"characterName"}>{character.name}</div>
      <Stats
        currentHealth={character.currentHealth}
        maxHealth={character.maxHealth}
        endurance={character.endurance}
        maxEndurance={character.maxEndurance}/>
      <div>{character.status}</div>
      <Attributes attributes={character.attributes}/>
      <Skills skills={character.skills}/>
      <Perks perks={character.perks}/>
    </div>
  )
}
