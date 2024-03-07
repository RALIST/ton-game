import GameLogger from "@/lib/utils/GameLogger";
import {LoggerEvents} from "@/lib/utils/GameEvents";
import StreamEvent from "@/lib/streams/StreamEvent";

export default class GameLoggerService {
  model: GameLogger

  public static async consume(data: any) {
    const model = await new GameLogger(data.userId).load()
    const instance = new GameLoggerService(model)
    await instance.handleEvent(data)
  }

  constructor(model: GameLogger) {
    this.model = model
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    // @ts-ignore
    if (event in this.eventHandlers) await this.eventHandlers[event](payload);
  }

  private eventHandlers = {
    [LoggerEvents.DUNGEON_STARTED]: async (payload: any) => {
      await this.model.logEvent("Вы начали вылазку", "info")
    },
    [LoggerEvents.DUNGEON_STOPPED]: async (payload: any) => {
      await this.model.clearLogs()
    },
    [LoggerEvents.CHARACTER_MOVE_STARTED]:  async (payload: any) => {
      await this.model.clearLogs()
    },
  }
}
