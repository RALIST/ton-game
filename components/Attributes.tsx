import {GameplayData} from "@/lib/utils/GameRenderer";

export default function Attributes({attributes}: {attributes: GameplayData["character"]["attributes"]}) {
  return(
    <div className={"characterAttributes"}>
      <div className={"title"}>Аттрибуты</div>
      {attributes.map((attr, index) => {
        return <div key={index} className={"attribute"}>
          <span className={"attributeName"}>{attr.name}</span>
          <span className={"attributeValue"}>{attr.value}</span>
        </div>
      })}
    </div>
  )
}
