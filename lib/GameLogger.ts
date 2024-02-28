import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";
import {GameplayEvents} from "@/lib/utils/enums";
import Enemy from "@/lib/Enemy";
import Item from "@/lib/Item";
import RandomEvent from "@/lib/RandomEvent";

export type LogEntry = {
  message: string,
  type: string
}

export class GameLogger implements WithRedisStorage{
  globalLogs!: LogEntry[]
  currentLogs!: LogEntry[]
  userId: number;
  storage!: RedisStorage

  constructor(userId: number) {
    this.globalLogs = []
    this.currentLogs = []
    this.userId = userId
    this.storage = new RedisStorage(`gamelogs:${this.userId}`)
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case GameplayEvents.MOVE_STARTED: {
        this.clearLogs()
        await this.dump()
        break;
      }
      case GameplayEvents.CHARACTER_TIRED: {
        this.alert("Ты очень устал! Отдохни немного!")
        await this.dump()
        break;
      }
      case GameplayEvents.ENEMIES_FOUND: {
        const {id, name, attack, defence } = payload.enemy as Enemy
        this.alert(`Ты встретил врага!`)
        this.enemy(`${name} (⚔️${attack} 🛡${defence})`)
        this.alert("Кажется, тебе конец...")
        await this.dump()
        break;
      }
      case GameplayEvents.ITEMS_FOUND: {
        const {id, name, itemType, description, rarity } = payload.item as Item
        this.success(`Ты обнаружил предмет!`)
        this.item(`${name} (${rarity}/${itemType})`)
        await this.dump()
        break;
      }
      case GameplayEvents.RANDOM_EVENT_FOUND: {
        const {id, name,description} = payload.event as RandomEvent
        this.info(`Опс, а что это: ${name}`)
        this.info(description)
        await this.dump()
        break;
      }
      case GameplayEvents.CHARACTER_ATTRIBUTES_CHANGED: {
        const { health, endurance} = payload
        if (health) {
          const {type, value} = health
          if (type === "subtract") this.alert(`Ты потерял ${value} здоровья!`); await this.dump()
        }

        if (endurance) {
          const {type, value} = endurance
          if (type === "subtract") this.info(`Ты потратил ${value} выносливости за этот переход!`); await this.dump()
        }
        break;
      }
      case GameplayEvents.REST_COMPLETED: {
        this.success("Ты хорошо отдохнул, пора в путь!")
        await this.dump();
        break
      }
      case GameplayEvents.ATTACK_COMPLETED: {
        this.success("Кажется, тебе удалось выжить в этой бойне. Едем дальше.")
        await this.dump();
      }
    }
  }

  async dump() {
    await this.storage.dump(this.toJson())
  }

  async load() {
    const data = await this.storage.load()

    this.currentLogs = data.currentLogs ?? []
    this.globalLogs = data.globalLogs ?? []

    return this
  }

  clearLogs() {
    this.currentLogs = []
  }

  logEvent(message: string, type: string) {
    this.logGlobalEvent(message, type)
    this.logCurrentEvent(message, type)
  }

  logGlobalEvent(message: string, type: string) {
    this.globalLogs.push({message: message, type: type})
  }

  logCurrentEvent(message: string, type: string) {
    this.currentLogs.push({message: message, type: type})
  }

  info(message: string) {
    this.logEvent(message, "info")
  }

  alert(message: string) {
    this.logEvent(message, "alert")
  }

  success(message: string) {
    this.logEvent(message, "success")
  }

  enemy(message: string) {
    this.logEvent(message, "enemy")
  }

  item(message: string) {
    this.logEvent(message, "item")
  }

  toJson(includeGlobal = false) {
    return {
      currentLogs: this.currentLogs,
      globalLogs: this.globalLogs
    }
  }
}
