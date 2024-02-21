import {Character} from "@/lib/Character";
import MainMenu from "@/components/MainMenu";

export class Gameplay {
  character: Character;

  constructor(character: Character) {
    this.character = character
  }

  draw() {
    const {balance, health, endurance, location , availableActions} = this.character
    return MainMenu({
      balance: balance,
      health: health,
      endurance: endurance,
      location: location,
      availableActions: availableActions
    })
  }
}
