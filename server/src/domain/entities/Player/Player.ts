import Character from "@/src/domain/entities/Character/Character";
import CharacterRepository from "@/src/infrostructure/respositories/CharacterRepository";

export default class Player extends Character {
  userId: number

  constructor(userId: number) {
    super();
    this.userId = userId
    this.isPlayer = true
    this.repo = new CharacterRepository(this.userId, true)
  }
}
