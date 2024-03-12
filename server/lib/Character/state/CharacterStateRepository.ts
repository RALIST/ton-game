import RedisStorage from "@/lib/utils/redis/RedisStorage";

export default class CharacterStateRepository {
  private storage!: RedisStorage
  userId: number

  constructor(userId: number) {
    this.storage = new RedisStorage();
    this.userId = userId
  }

  async load() {
    const data = await this.storage.load(`characterstate:${this.userId}`)
    return data || null;
  }

  async dump(characterData: any) {
    await this.storage.dump(`characterstate:${this.userId}`, characterData)
  }

  async update(data: any) {
    await this.storage.update(`characterstate:${this.userId}`, data)
  }
}
