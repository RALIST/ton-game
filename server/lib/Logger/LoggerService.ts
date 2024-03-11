import LoggerModel from "@/lib/Logger/LoggerModel";
import {LoggerEvents} from "@/lib/utils/GameEvents";
import BaseService from "@/lib/utils/services/BaseService";
import {LogEntry} from "@/lib/Logger/types";

export default class LoggerService extends BaseService {
  public static async consume(data: any) {
    console.log("Logger service handling event:", data)
    const model = await new LoggerModel(data.userId).load()
    const instance = new LoggerService(model)
    await instance.handleEvent(data)
  }

  constructor(model: LoggerModel) {super(model)}

  private eventHandlers = {
    [LoggerEvents.DUNGEON_STARTED]: async () => {
      await this.model.logEvent("Вы начали вылазку", "info")
    },

    [LoggerEvents.DUNGEON_STOPPED]: async () => {
      await this.model.clearLogs()
    },

    [LoggerEvents.CHARACTER_MOVE_STARTED]: async () => {
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
