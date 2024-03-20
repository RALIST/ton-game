import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {GameplayData} from "../../../types/gameplay";
import React from "react";

export default function ShopScene({game}: {game: GameplayData}) {
  return(
    <>
      <Header character={game.character}/>
      <Footer game={game}/>
    </>
  )
}
