import style from "../Game.module.css";

export default function PlayerScene({player}: { player: any}) {
  return(
    <div className={style.game}>
      <h1 className={""}>{player.name}</h1>
      <div>
        {player.attributes.map((attr: { name: string; value: number }, index: number) => {
          return <div key={index}><span>{attr.name}</span> <span>{attr.value}</span></div>
        })}
      </div>
      <div>
        {player.stats.map((attr: { name: string; value: number }, index: number) => {
          return <div key={index}><span>{attr.name}</span> <span>{attr.value}</span></div>
        })}
      </div>
    </div>
  )
}
