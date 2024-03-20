import Character from "@/lib/Character/Character";
import CharacterRepository from "@/lib/Character/CharacterRepository";

export default class Player extends Character {
  userId: number

  constructor(userId: number) {
    super();
    this.userId = userId
    this.isPlayer = true
    this.repo = new CharacterRepository(this.userId, true)
  }
}
