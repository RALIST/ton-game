import {RedisStorage} from "@/lib/utils/redis/RedisStorage";
import {Character} from "@/lib/Character/types";

export default class CharacterRepository {
  private storage!: RedisStorage

  constructor(userId: number) {
    this.storage = new RedisStorage(`character:${userId}`);
  }

  async loadCharacterData() {
    const data = await this.storage.load()
    return data || null;
  }

  async dump(characterData: Character) {
    await this.storage.dump(characterData)
  }

  async update(data: Partial<Character>) {
    await this.storage.update(data)
  }
}
