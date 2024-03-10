import ActionList from "@/components/ActionList";
import FooterMenu from "@/components/FooterMenu";
import CurrentLocation from "@/components/CurrentLocation";
import {GameplayData} from "@lib/utils/GameRenderer";
import Scene from "@/components/Scene";
import HeaderMenu from "@/components/HeaderMenu";
import {useBackButton} from "@tma.js/sdk-react";
import {useEffect} from "react";

export default function Dungeon({game}: {game: GameplayData}) {
  const backButton = useBackButton()
  useEffect(() => {
    backButton.hide();
  }, [backButton]);

  return <div className={"gameScreen"}>
    <>
      <HeaderMenu character={game.character}/>
      <div className={"gameScreen"}>
        <CurrentLocation location={game.currentLocation}/>
        <div className={"title"}>{game.currentLocation.id}/{game.totalLocations}</div>
        <Scene log={game.currentLogs}/>
        <ActionList actions={game.availableActions}/>
      </div>
    </>
  </div>
}
