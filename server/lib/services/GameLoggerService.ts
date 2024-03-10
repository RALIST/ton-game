import GameLogger, {LogEntry} from "@/lib/services/GameLogger";
import {LoggerEvents} from "@/lib/utils/GameEvents";
import BaseService from "@/lib/services/BaseService";

export default class GameLoggerService extends BaseService {
  public static async consume(data: any) {
    const model = await new GameLogger(data.userId).load()
    const instance = new GameLoggerService(model)
    await instance.handleEvent(data)
  }

  constructor(model: GameLogger) {super(model)}

  private eventHandlers = {
    [LoggerEvents.DUNGEON_STARTED]: async (payload: any) => {
      await this.model.logEvent("Вы начали вылазку", "info")
    },

    [LoggerEvents.DUNGEON_STOPPED]: async (payload: any) => {
      await this.model.clearLogs()
    },

    [LoggerEvents.CHARACTER_MOVE_STARTED]: async (payload: any) => {
      await this.model.clearLogs()
    },

    [LoggerEvents.ENEMIES_FOUND]: async (payload: any) => {
      await this.model.logEvent("Ты встретил врага!", "alert")
      await this.model.logEvent(`${payload.enemy.name}`, "enemy")
    },

    [LoggerEvents.CHARACTER_ATTACK_COMPLETED]: async (payload: any) => {
      const message1: LogEntry = {message: `Ты нанес ${payload.damage} урона врагу`, type: "alert"}
      const message2: LogEntry = {message: `Ты победил в этой схватке!`, type: "success"}
      await this.model.repo.update({currentLogs: [...this.model.currentLogs, message1, message2]})
    },

    [LoggerEvents.CHARACTER_TIRED]: async () => {
      await this.model.logEvent("Ты очень устал, нужен отдых", "info")
    }
  }
}
