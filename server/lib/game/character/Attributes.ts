import {CharacterAttribute} from "@/types/character";

export default class Attributes {
  static initialize(initData?: CharacterAttribute[]) {
    return initData ?? [
      { name: "Сила", description: "", value: 1 },
      { name: "Восприятие", description: "", value: 1 },
      { name: "Выносливость", description: "", value: 1 },
      { name: "Харизма", description: "", value: 1 },
      { name: "Интеллект", description: "", value: 1 },
      { name: "Ловкость", description: "", value: 1 },
      { name: "Удача", description: "", value: 1 },
    ];
  }
}
