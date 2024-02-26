import {Character} from "@/lib/Character";
import {GameplayState} from "@/lib/GameplayState";
import ActionList from "@/components/ActionList";
import FooterMenu from "@/components/FooterMenu";
import HeaderMenu from "@/components/HeaderMenu";
import CurrentLocation from "@/components/CurrentLocation";
import Scene from "@/components/Scene";
import {LogEntry} from "@/lib/GameLogger";
import ScreenBackground from "@/components/ScreenBackgound";

export default function MainScreen({character, availableActions, state, log}:
  {
    character: Character,
    availableActions: string[],
    state: GameplayState,
    log: LogEntry[]
  })
{
  return (
    <div className={"screen"}>
      <HeaderMenu character={character}/>
      <div className={"gameScreen"}>
        <CurrentLocation location={state.currentLocation}/>
        <Scene log={log}/>
        <ActionList actions={availableActions}/>
      </div>
      <FooterMenu/>
      <ScreenBackground/>
    </div>
  )
}
