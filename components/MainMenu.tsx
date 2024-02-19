import {AppUser} from "@/app/page";
import Image from "next/image";

import footerImage from "../assets/floor.png"
import bgImage from "../assets/houses.png"

export default function MainMenu({ user }: { user: AppUser | null }) {
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className={"screen"}>
        <div className={"gameHeader"}>
          <div>❤️ 300/600</div>
          <div>💶 999.999</div>
          <div>🌡️ 87%</div>
        </div>
        <div className={"gameScreen"}>
          <div className={"scene"}>
            <h2>Ты отправился в пустоши</h2>
            <div>
              <p style={{textAlign: "justify"}}>В борьбе за выживание ты бросил вызов беспощадной Пустоши.
                Чем дальше ты заходишь в Пустоши - тем сложнее тебе будет там выжить. Путь займёт несколько минут.</p>
              <h3 style={{textAlign: "center"}}>05:26</h3>
            </div>
          </div>
          <div className={"actions"}>
            <div className={"button"}>Атаковать</div>
            <div className={"button"}>Вызвать на дуель</div>
            <div className={"commonActions"}>
              <div className={"button"}>Идти дальше</div>
              <div className={"button"}>Осмотреться</div>
            </div>
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
