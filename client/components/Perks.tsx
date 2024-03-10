import {GameplayData} from "@lib/utils/GameRenderer";

export default function Perks({perks}: {perks: GameplayData["character"]["perks"]}) {
  return (
    <div className={"characterPerks"}>
      <div className={"title"}>Перки</div>
      {perks.map((perk, index) => {
        return (
          <div key={index}>
            <div className={"perk"}>{perk.name}</div>
            <div className={"perkDesc"}>{perk.description}</div>
          </div>
        )
      })}
    </div>
  )
}
