import ActionList from "@/components/ActionList";
import FooterMenu from "@/components/FooterMenu";
import HeaderMenu from "@/components/HeaderMenu";
import CurrentLocation from "@/components/CurrentLocation";
import Scene from "@/components/Scene";
import ScreenBackground from "@/components/ScreenBackgound";
import {GameplayData} from "@/lib/SceneRenderer";

function Timer() {
  return (<div>

  </div>)
}

export default function MainScreen({game}: { game: GameplayData }) {
  let actions;
  if (game.character.status !== "inAction") {
    actions = <ActionList actions={game.availableActions}/>
  } else {
    actions = <Timer/>
  }
  return (
    <div className={"screen"}>
      <HeaderMenu character={game.character}/>
      <div className={"gameScreen"}>
        <CurrentLocation location={game.currentLocation}/>
        <Scene log={game.currentLogs}/>
        {actions}
      </div>
      <FooterMenu/>
      <ScreenBackground/>
    </div>
  )
}
