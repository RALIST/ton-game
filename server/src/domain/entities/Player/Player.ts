import Character from "@/src/domain/entities/Character/Character";
import {CharacterStates} from "@/src/domain/entities/Character/types";

export default class Player extends Character {
  activeRouteId!: number | null

  constructor(id: number) {
    super();
    this.id = id
    this.isPlayer = true
  }

  setState(state: CharacterStates) {
    this.state = state;

    return true
  }
}
