import RedisStorage from "@/lib/utils/redis/RedisStorage";
import {User} from "@/lib/User/types";

export default class UserRepository {
  private storage!: RedisStorage
  userId: number

  constructor(userId: number) {
    this.storage = new RedisStorage();
    this.userId = userId
  }

  async load() {
    const data = await this.storage.load(`user:${this.userId}`)
    return data || null;
  }

  async dump(characterData: User) {
    await this.storage.dump(`user:${this.userId}`, characterData)
  }

  async update(data: Partial<User>) {
    await this.storage.update(`user:${this.userId}`, data)
  }
}
