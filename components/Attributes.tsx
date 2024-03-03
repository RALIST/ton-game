import {GameplayData} from "@/lib/GameRenderer";

export default function Attributes({attributes}: {attributes: GameplayData["character"]["attributes"]}) {
  return(
    <div className={"characterAttributes"}>
      <div className={"title"}>Аттрибуты</div>
      {attributes.map((attr, index) => {
        return <div key={index} className={"attribute"}>{attr.name}: {attr.value}</div>
      })}
    </div>
  )
}
