import RedisStorage from "@/src/infrostructure/databases/redis/RedisStorage";
import Character from "@/src/domain/entities/Character/Character";

export default class CharacterRepository {
  private storage!: RedisStorage

  id: number
  key: string

  constructor(id: number, isPlayer: boolean) {
    this.storage = new RedisStorage();
    this.id = id
    this.key = !isPlayer ? `characters:${id}` : `characters:players:${id}`
  }

  async load() {
    const data = await this.storage.load(this.key)
    return data || null;
  }

  async save(characterData: Character) {
    await this.storage.dump(this.key, characterData)
  }

  async update(data: Partial<Character>) {
    await this.storage.update(this.key, data)
  }
}
