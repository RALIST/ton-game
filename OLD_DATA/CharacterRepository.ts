import RedisStorage from "@/lib/utils/redis/RedisStorage";
import {CharacterType} from "@/lib/OLD_DATA/types";

export default class CharacterRepository {
  private storage!: RedisStorage
  userId: number

  constructor(userId: number) {
    this.storage = new RedisStorage();
    this.userId = userId
  }

  async load() {
    const data = await this.storage.load(`character:${this.userId}`)
    return data || null;
  }

  async dump(characterData: CharacterType) {
    await this.storage.dump(`character:${this.userId}`, characterData)
  }

  async update(data: Partial<CharacterType>) {
    await this.storage.update(`character:${this.userId}`, data)
  }
}
