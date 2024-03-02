import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";
import {LoggerEvents} from "@/lib/utils/gameEvents";
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
      case LoggerEvents.MOVE_STARTED: {
        await this.clearLogs()
        break;
      }
      case LoggerEvents.CHARACTER_TIRED: {
        await this.alert("Ты очень устал! Отдохни немного!")
        break;
      }
      case LoggerEvents.CHARACTER_DEAD: {
        await this.alert("Ты умер. Соболезную.")
        break;
      }
      case LoggerEvents.ENEMIES_FOUND: {
        const {id, name, attack, defence } = payload.enemy as Enemy
        await this.alert(`Ты встретил врага!`)
        await this.enemy(`${name} (⚔️${attack} 🛡${defence})`)
        await this.alert("Кажется, тебе конец...")
        break;
      }
      case LoggerEvents.ITEMS_FOUND: {
        const {id, name, itemType, description, rarity } = payload.item as Item
        await this.success(`Ты обнаружил предмет!`)
        await this.item(`${name} (${rarity}/${itemType})`)
        break;
      }
      case LoggerEvents.RANDOM_EVENT_FOUND: {
        const {id, name,description} = payload.event as RandomEvent
        await this.info(`Опс, а что это: ${name}`)
        await this.info(description)
        break;
      }
      case LoggerEvents.DANGER_EVENT_FOUND: {
        await this.alert("Ты зачем то полез в темный подвал. Что ты там хотел найти? В темноте ты напоролся на острую арматуру. Будет тебе уроком.")
        break
      }
      case LoggerEvents.CHARACTER_ATTRIBUTES_CHANGED: {
        const { health, endurance} = payload
        if (health) {
          const {type, value} = health
          if (type === "subtract")
            await this.alert(`Ты потерял ${value} здоровья!`);
        }

        // if (endurance) {
        //   const {type, value} = endurance
        //   if (type === "subtract")
        //     await this.info(`Ты потратил ${value} выносливости за этот переход!`);
        // }

        break;
      }
      case LoggerEvents.REST_COMPLETED: {
        await this.success("Ты хорошо отдохнул, пора в путь!")
        break
      }
      case LoggerEvents.ATTACK_COMPLETED: {
        await this.success("Кажется, тебе удалось выжить в этой бойне. Едем дальше.")
        break;
      }
      case LoggerEvents.NOTHING_FOUND: {
        await this.info("До тебя здесь побывало куча людей, даже дырявого мешка не найти.")
        break;
      }
      case LoggerEvents.RUN_COMPLETED: {
        await this.alert("Враг вдогонку пнул тебя и кричал всякие неприятные вещи!")
        await this.info("Тебе стоит вернуться и отомстить ему при случае. Такое нельзя терпеть!")
        await this.success(`Ты убежал от врага в ${payload.location}`)
        break;
      }
    }
  }

  async dump() {
    await this.storage.dump(this.toJson())
  }

  async append(arr: string, item: any) {
    await this.storage.append(arr, item)
  }

  async load() {
    const data = await this.storage.load()
    this.currentLogs = data?.currentLogs ?? []
    this.globalLogs = data?.globalLogs ?? []

    return this
  }

  async clearLogs() {
    this.currentLogs = []
    await this.dump()
  }

  async logEvent(message: string, type: string) {
    await this.logCurrentEvent(message, type)
  }

  async logCurrentEvent(message: string, type: string) {
    await this.append("currentLogs", {message: message, type: type})
  }

  async info(message: string) {
    await this.logEvent(message, "info")
  }

  async alert(message: string) {
    await this.logEvent(message, "alert")
  }

  async success(message: string) {
    await this.logEvent(message, "success")
  }

  async enemy(message: string) {
    await this.logEvent(message, "enemy")
  }

  async item(message: string) {
    await this.logEvent(message, "item")
  }

  toJson(includeGlobal = false) {
    return {currentLogs: this.currentLogs}
  }
}
