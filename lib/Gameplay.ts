import {Character} from "@/lib/Character";
import {GameMap} from "@/lib/GameMap";
import {GameplayState} from "@/lib/GameplayState";
import {GameLogger} from "@/lib/GameLogger";
import {EventStore} from "@/lib/EventStore";
import {GameCommands, GameplayEvent, MapEvents} from "@/lib/utils/enums";
import emitEvent from "@/lib/utils/events";

export class Gameplay {
  userId!: number;
  character!: Character;
  map!: GameMap;
  state!: GameplayState;
  logger!: GameLogger;
  eventStore!: EventStore
  pushStream!: string;
  availableActions!: string[]

  constructor() {
    this.pushStream = "gameplay"
  }

  async load(userId: number) {
    this.userId = userId
    this.map = await new GameMap().load();
    this.logger = new GameLogger();
    this.eventStore = await new EventStore(userId).load();
    this.character = await new Character(userId).load()
    this.state = await new GameplayState(userId).load()

    return this
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case MapEvents.LOCATION_CHANGED: {
        await emitEvent(GameplayEvent.MOVE_COMPLETED, payload, "gameplay")
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
          GameplayEvent.MOVE_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.ATTACK: {
        await emitEvent(
          GameplayEvent.ATTACK_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.RUN: {
        await emitEvent(
          GameplayEvent.RUN_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.LOOK: {
        await emitEvent(
          GameplayEvent.LOOK_STARTED,
          {userId: this.userId},
          this.pushStream)
        break
      }
      case GameCommands.BACK: {
        await emitEvent(
          GameplayEvent.BACK_STARTED,
          {userId: this.userId},
          this.pushStream
        )
        break
      }
      default: { return }
    }
  }

  async toJson(includeGlobalLogs = false){
    const state = await new GameplayState(this.userId).load()
    const character = await new Character(this.userId).load()
    this.availableActions = state.getAvailableAction()

    return {
      logger: this.logger.toJson(includeGlobalLogs),
      character: character ,
      state: state,
      availableActions: state.getAvailableAction(),
      currentScene: state.currentScene
    }
  }
}
