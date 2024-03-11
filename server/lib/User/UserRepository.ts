import {RedisStorage} from "@/lib/utils/redis/RedisStorage";
import {User} from "@/lib/User/types";

export default class UserRepository {
  private storage!: RedisStorage

  constructor(userId: number) {
    this.storage = new RedisStorage(`user:${userId}`);
  }

  async load() {
    const data = await this.storage.load()
    return data || null;
  }

  async dump(characterData: User) {
    await this.storage.dump(characterData)
  }

  async update(data: Partial<User>) {
    await this.storage.update(data)
  }
}
