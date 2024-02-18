import {AppUser} from "@/app/page";
import {useEffect, useState} from "react";

export default function MainMenu({ user }: { user: AppUser | null }) {
  const [date, setDate] = useState<string | null>(null);
  useEffect(() => {
    setDate(new Date().toLocaleDateString())
  }, []);


  if (!user) {
    return <div>Loading...</div>
  }

  const username = user?.username || "Adventurer"
  return (
    <div className={"screen"}>
      <div className={"gameHeader"}>
        <div>❤️ 300/600</div>
        <div>💶 999.999</div>
        <div>🌡️ 87%</div>
      </div>
      <div className={"gameScreen"}>
        <div className={"scene"}>
          <pre>{username} connected</pre>
          <p>
            <pre>{date}</pre>
            Оставаться здесь дальше не имело смысла. В борьбе за выживание ты бросил вызов беспощадной Пустоши.
            Чем дальше ты заходишь в Пустоши - тем сложнее тебе будет там выжить.
            ⏳ Путь займёт несколько минут.
          </p>
          <p>
            <pre>{date}</pre>
            Во время вылазки на тебя напал 🐜Радтаракан (Слабый).
            Ты можешь попробовать вступить с ним в битву, или же попытаться убежать.
          </p>
          <p className={"gameText"}>
            <pre>{date}</pre>
            ⏳ Ты решил вступить в схватку с противником.
            Опасное это дело, дружочек.
            Посмотрим, что из этого получится.
          </p>
          <p>
            <pre>{date}</pre>
            Сражение с 🐜Радтаракан (Слабый)
            👤Ты сделал больно иначе 💥579
            Ты одержал победу!
            Получено: 🕳20 и 📦16
          </p>
          <p>
            <pre>{date}</pre>
            Сражение с 🐜Радтаракан (Слабый)
            👤Ты сделал больно иначе 💥579
            Ты одержал победу!
            Получено: 🕳20 и 📦16
          </p>
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
        <div>Персонаж</div>
        <div>Инвентарь</div>
        <div>Карта</div>
      </div>
    </div>
  )
}
