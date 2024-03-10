import style from "./Header.module.css";
import Energy from "./Energy/Energy";
import React from "react";

export default function Header({character}: { character: GameplayData["character"]}) {
  return <header className={style.header}>
    <Energy icon={'❤️'} color={'red'} value={character.currentHealth} max={character.maxHealth}/>
    <Energy icon={'⚡️'} color={'darkorange'} value={character.endurance} max={character.maxEndurance}/>
    {/*<Money value={game.character.balance} />*/}
  </header>
}
