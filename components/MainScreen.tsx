import Image from "next/image";
import footerImage from "../assets/floor.png"
import bgImage from "../assets/houses.png"
import {Action, LogEntry} from "@/lib/Gameplay";
import {GameLocation} from "@/lib/GameLocation";
import {Character} from "@/lib/Character";
import {GameplayState} from "@/lib/GameplayState";
import Link from "next/link";

function Timer({time}: {time: number | null}) {
  if (time) {
    const date = new Date(time * 1000)
    return(<div style={{fontSize: "18px", fontWeight: "Bold"}}>
      {date.toLocaleTimeString("en-US", {minute: "2-digit", second: "2-digit"})}
    </div>)
  } else {
    return <div></div>
  }
}

export default function MainScreen({character, location, availableActions, state, log}:
  {
    character: Character,
    location: GameLocation,
    availableActions: Action[],
    state: GameplayState,
    log: LogEntry[]
  })
{
  return (
    <>
      <div className={"screen"}>
        <div className={"gameHeader"}>
          <div>❤️ {character.currentHealth}/{character.maxHealth}</div>
          <div>💶 {character.balance}</div>
          <div>🌡️ {character.endurance}</div>
        </div>
        <div className={"gameScreen"}>
          <div style={{textAlign: "center", fontWeight: "bold"}}>{location.name}</div>
          <div style={{textAlign: "justify"}}>{location.desc}</div>
          <div className={"scene"}>
            <div>
              {log.toReversed().map(event => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <div className={"log"}>
                    <span className={event.type}>{event.message}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={"actions"}>
            <div style={{textAlign: "center"}}>
              <Timer time={state.timeToNextAction}/>
            </div>
            {availableActions.map(action => {
                return (<div key={action.name} onClick={action.callback} className={"button"}>{action.name}</div>)
              }
            )}
          </div>
        </div>
        <div className={"gameFooter"}>
          {/*TODO: think about how to render inside game engine*/}
          <div className={"button"}><Link href={"/character"}>Персонаж</Link></div>
          <div className={"button"}><Link href={"/inventory"}>Инвентарь</Link></div>
          <div className={"button"}><Link href={"/map"}>Карта</Link></div>
        </div>
        <div className={"bgImage"}>
          <Image src={bgImage} alt={""}></Image>
        </div>
        <div className={"footerImage"}>
          <Image src={footerImage} alt={""}></Image>
        </div>
      </div>
    </>
  )
}
