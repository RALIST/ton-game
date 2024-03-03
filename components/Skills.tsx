import {GameplayData} from "@/lib/GameRenderer";

export default function Skills({skills}: {skills: GameplayData["character"]["skills"]}) {
  return (
    <div className={"characterSkills"}>
      <div className={"title"}>Навыки</div>
      {skills.map(({skill, exp, level}, index) => {
        return <div key={index} className={"skill"}>{skill.name}: {level} ({exp})</div>
      })}
    </div>
  )
}
