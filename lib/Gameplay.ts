import {Character} from "@/lib/Character";
import {GameMap} from "@/lib/GameMap";
import {GameplayState} from "@/lib/GameplayState";
import {GameLogger, LogEntry} from "@/lib/GameLogger";
import {GameCommands, GameplayEvents} from "@/lib/utils/enums";
import emitEvent from "@/lib/utils/events";
import {GameLocation} from "@/lib/GameLocation";

export class Gameplay {
  userId: number;
  map!: GameMap;
  logger!: GameLogger;
  pushStream!: string;
  availableActions!: string[]

  constructor(userId: number) {
    this.pushStream = "gameplay"
    this.userId = userId
    this.logger = new GameLogger();
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case GameplayEvents.LOCATION_CHANGED: {
        await emitEvent(GameplayEvents.MOVE_COMPLETED, payload, "gameplay")
      }
    }
  }

  async performAction(action: string, payload: any) {
    // @ts-ignore
    if (!(Object.values(GameCommands).includes(action))) {
      return;
    }

    console.log("Gameplay received action:", action)

    switch (action) {
      case GameCommands.MOVE: {
        await emitEvent(
          GameplayEvents.MOVE_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.ATTACK: {
        await emitEvent(
          GameplayEvents.ATTACK_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.RUN: {
        await emitEvent(
          GameplayEvents.RUN_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.LOOK: {
        await emitEvent(
          GameplayEvents.LOOK_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.BACK: {
        await emitEvent(
          GameplayEvents.BACK_STARTED,
          {userId: this.userId},
          this.pushStream
        )
        break
      }
      default: { return }
    }
  }

  async toJson(includeGlobalLogs = false): Promise<GameplayData> {
    const state = await new GameplayState(this.userId).load()
    const character = await new Character(this.userId).load()
    this.availableActions = state.getAvailableAction()
    const location = await state.currentLocation()

    return {
      logger: this.logger.toJson(includeGlobalLogs),
      character: character ,
      state: state,
      currentLocation: location,
      availableActions: state.getAvailableAction(),
      currentScene: state.currentScene,
      error: ""
    }
  }
}

export type GameplayData = {
  logger: {
    currentLogs: LogEntry[]
  },
  character: Character,
  state: GameplayState,
  availableActions: string[],
  currentScene: string,
  currentLocation: GameLocation
  error: string
}
