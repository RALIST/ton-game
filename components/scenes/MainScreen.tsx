import ActionList from "@/components/ActionList";
import FooterMenu from "@/components/FooterMenu";
import HeaderMenu from "@/components/HeaderMenu";
import CurrentLocation from "@/components/CurrentLocation";
import Scene from "@/components/Scene";
import ScreenBackground from "@/components/ScreenBackgound";
import {GameplayData} from "@/lib/Gameplay";

export default function MainScreen({game}:
  {
    game: GameplayData
  })
{
  return (
    <div className={"screen"}>
      <HeaderMenu character={game.character}/>
      <div className={"gameScreen"}>
        <CurrentLocation location={game.currentLocation}/>
        <Scene log={game.logger.currentLogs}/>
        <ActionList actions={game.availableActions}/>
      </div>
      <FooterMenu/>
      <ScreenBackground/>
    </div>
  )
}
