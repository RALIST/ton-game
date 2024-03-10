import style from "../Game.module.css";
import {gameCommandLabels} from "../../../enums/GameCommands";
import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function VillageScene({game}: { game: GameplayData}) {
  return (
    <div className={style.game}>
      <Header character={game.character}/>
      <main className={style.main}>
        {game.availableActions.map((action, index) => {
          // @ts-ignore
          return <div key={index}>{gameCommandLabels[action]}</div>
        } )}
      </main>
      <Footer />
    </div>
  );
}
