import ActionList from "@/components/ActionList";
import FooterMenu from "@/components/FooterMenu";
import HeaderMenu from "@/components/HeaderMenu";
import CurrentLocation from "@/components/CurrentLocation";
import Scene from "@/components/Scene";
import ScreenBackground from "@/components/ScreenBackgound";
import {GameplayData} from "@/lib/GameRenderer";
import {useBackButton} from "@tma.js/sdk-react";
import {useEffect} from "react";

function Timer() {
  return (<div>
  </div>)
}

export default function MainScreen({game}: { game: GameplayData }) {
  const backButton = useBackButton()
  useEffect(() => {
    backButton.hide();
  }, [backButton]);

  return (
    <>
      <HeaderMenu character={game.character}/>
      <div className={"gameScreen"}>
        <CurrentLocation location={game.currentLocation}/>
        <Scene log={game.currentLogs}/>
        <ActionList actions={game.availableActions}/>
      </div>
      <FooterMenu/>
    </>
  )
}
