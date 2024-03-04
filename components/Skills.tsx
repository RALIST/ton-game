import {GameplayData} from "@/lib/utils/GameRenderer";

export default function Skills({skills}: {skills: GameplayData["character"]["skills"]}) {
  return (
    <div className={"characterSkills"}>
      <div className={"title"}>Навыки</div>
      {skills.map(({skill, exp, level}, index) => {
        return <div key={index} className={"skill"}>
          <span className={"skillName"}>{skill.name} ур. {level}</span>
          <div className={"skillDesc"}>{skill.description}</div>
        </div>
      })}
    </div>
  )
}
