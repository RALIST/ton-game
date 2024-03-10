import {RedisStorage} from "@/lib/repositories/RedisStorage";
import {CharacterData} from "@/types/character";

export default class CharacterRepository {
  private storage!: RedisStorage

  constructor(userId: number) {
    this.storage = new RedisStorage(`character:${userId}`);
  }

  async loadCharacterData() {
    const data = await this.storage.load()
    return data || null;
  }

  async dump(characterData: CharacterData) {
    await this.storage.dump(characterData)
  }

  async update(data: Partial<CharacterData>) {
    await this.storage.update(data)
  }
}
