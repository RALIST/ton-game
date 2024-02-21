import Image from "next/image";
import footerImage from "../assets/floor.png"
import bgImage from "../assets/houses.png"
import {Action} from "@/lib/Character";

export default function MainMenu({balance, health, endurance, location, availableActions}:
  {
    balance: number,
    health: any,
    endurance: number,
    location: string,
    availableActions: Action[]
  })
{
  return (
    <>
      <div className={"screen"}>
        <div className={"gameHeader"}>
          <div>❤️ {health[0]}/{health[1]}</div>
          <div>💶 {balance}</div>
          <div>🌡️ {endurance}</div>
        </div>
        <div className={"gameScreen"}>
          <div className={"scene"}>
            <h2>{location}</h2>
            <div>
              <p style={{textAlign: "justify"}}>В борьбе за выживание ты бросил вызов беспощадной Пустоши.
                Чем дальше ты заходишь в Пустоши - тем сложнее тебе будет там выжить. Путь займёт несколько минут.</p>
              <h3 style={{textAlign: "center"}}>05:26</h3>
            </div>
          </div>
          <div className={"actions"}>
            {availableActions.map(action => {
                return(<div key={action.name} onClick={action.callback} className={"button"}>{action.name}</div>)
              }
            )}
          </div>
        </div>
        <div className={"gameFooter"}>
          <div className={"button"}>Персонаж</div>
          <div className={"button"}>Инвентарь</div>
          <div className={"button"}>Карта</div>
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
