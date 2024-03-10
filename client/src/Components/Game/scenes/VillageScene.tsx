import style from "../Game.module.css";
import Energy from "../Energy/Energy";
import {gameCommandLabels} from "../../../enums/GameCommands";
import React from "react";

export default function VillageScene({game}: { game: GameplayData}) {
  return (
    <div className={style.game}>
      <header className={style.header}>
        <Energy icon={'❤️'} color={'red'} value={game.character.currentHealth} max={game.character.maxHealth} />
        <Energy icon={'⚡️'} color={'darkorange'} value={game.character.endurance} max={game.character.maxEndurance} />
        {/*<Money value={game.character.balance} />*/}
      </header>
      <main className={style.main}>
        {game.availableActions.map((action, index) => {
          // @ts-ignore
          return <div key={index}>{gameCommandLabels[action]}</div>
        } )}
      </main>
      <footer className={style.footer}>
      </footer>
    </div>
  );
}
