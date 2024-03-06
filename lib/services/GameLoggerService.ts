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
    [LoggerEvents.CHARACTER_MOVE_STARTED]: async (payload: any) =>  this.model.handleMoveStarted(payload),
    [LoggerEvents.CHARACTER_TIRED]: async (payload: any) => this.model.handleCharacterTired(payload),
    [LoggerEvents.RANDOM_EVENT_FOUND]: async (payload: any) => this.model.handleRandomEventFound(payload),
    [LoggerEvents.DANGER_EVENT_FOUND]: async (payload: any) => this.model.handleDangerEventFound(payload),
    [LoggerEvents.ENEMIES_FOUND]: async (payload: any) => this.model.handleEnemiesFound(payload),
    [LoggerEvents.ITEMS_FOUND]: async (payload: any) => this.model.handleItemsFound(payload),
    [LoggerEvents.CHARACTER_ATTRIBUTES_CHANGED]: async (payload: any) => this.model.handleCharacterAttributesChanged(payload),
    [LoggerEvents.CHARACTER_ATTACK_COMPLETED]: async (payload: any) => this.model.handleCharacterAttackCompleted(payload),
    [LoggerEvents.NOTHING_FOUND]: async (payload: any) => this.model.handleNothingFound(payload),
    [LoggerEvents.REST_COMPLETED]: async (payload: any) => this.model.handleRestCompleted(payload),
    [LoggerEvents.CHARACTER_RUN_COMPLETED]: async (payload: any) => this.model.handleRunCompleted(payload),
  }
}
