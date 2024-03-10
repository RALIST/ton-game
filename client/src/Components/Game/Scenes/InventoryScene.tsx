import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Inventory from "../Inventory/Inventory";

export default function InventoryScene({game}: { game: GameplayData}) {
  return (<>
    <Header character={game.character}/>
    <Inventory/>
    <Footer/>
  </>);
}
