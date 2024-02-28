import {GameCommands, GameplayEvents} from "@/lib/utils/enums";
import emitEvent from "@/lib/utils/events";
import StreamEvent from "@/lib/streams/StreamEvent";

export default class GamePerformer {
  userId: number
  constructor(userId: number) {
    this.userId = userId
  }
  async performAction(action: string, payload: any) {
    const availableCommands = Object.values(GameCommands) as string[]
    if (!availableCommands.includes(action)) return;

    const actionEvent = this.detectEvent(action)
    const availableEvents = Object.values(GameplayEvents) as string[]
    if(!availableEvents.includes(actionEvent)) return

    const createdEvent=  new StreamEvent(this.userId, actionEvent, payload)
    await emitEvent(createdEvent, "gameplay")
  }

  detectEvent(action: string): string {
    let actionEvent = "";
    switch (action) {
      case GameCommands.MOVE: {
        actionEvent = GameplayEvents.MOVE_STARTED
        break;
      }
      case GameCommands.ATTACK: {
        actionEvent = GameplayEvents.ATTACK_STARTED
        break
      }
      case GameCommands.RUN: {
        actionEvent =  GameplayEvents.RUN_STARTED
        break
      }
      case GameCommands.LOOK: {
        actionEvent = GameplayEvents.LOOK_STARTED
        break
      }
      case GameCommands.REST: {
        actionEvent = GameplayEvents.REST_STARTED
      }
    }

    return actionEvent
  }
}
