import skillsData from "@/lib/Character/data/skills.json"
import {CharacterSkill} from "@/lib/Character/types";
import Skill from "@/lib/Character/Skill";

export default class Skills {
  static initialize(initData?: CharacterSkill[] ) {
    return initData ?? skillsData.map((skill: Skill) => {
      return {skill: skill, level: 1, exp: 0}
    });
  }
}
