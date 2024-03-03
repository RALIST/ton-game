import {GameplayData} from "@/lib/GameRenderer";

export default function Perks({perks}: {perks: GameplayData["character"]["perks"]}) {
  return (
    <div className={"characterPerks"}>
      <div className={"title"}>Перки</div>
      {perks.map((perk, index) => {
        return <div key={index} className={"perk"}>{perk.name}</div>
      })}
    </div>
  )
}
