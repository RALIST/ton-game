import skillsData from "@/lib/data/skills.json"
import Skill from "@/lib/game/Skill";
import type {CharacterSkill} from "@/types/character";

export default class Skills {
  static initialize(initData?: CharacterSkill[] ) {
    return initData ?? skillsData.map((skill: Skill) => {
      return {skill: skill, level: 1, exp: 0}
    });
  }
}
