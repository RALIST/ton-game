import {GameEvents} from "@/lib/utils/GameEvents";
import emitEvent from "@/lib/utils/emitEvent";
import StreamEvent from "@/lib/streams/StreamEvent";
import {GameCommands} from "@/lib/utils/GameCommands";

export default class GamePerformer {
  userId: number
  constructor(userId: number) {
    this.userId = userId
  }
  async performAction(action: string, payload: any) {
    const availableCommands = Object.values(GameCommands) as string[]
    if (!availableCommands.includes(action)) return;

    const actionEvent = this.detectEvent(action)
    const availableEvents = Object.values(GameEvents) as string[]
    if(!availableEvents.includes(actionEvent)) return

    const createdEvent=  new StreamEvent(this.userId, actionEvent, payload)
    await createdEvent.send()
  }

  detectEvent(action: string): string {
    let actionEvent = "";
    switch (action) {
      case GameCommands.MOVE: {
        actionEvent = GameEvents.CHARACTER_MOVE_STARTED
        break;
      }

      case GameCommands.ATTACK: {
        actionEvent = GameEvents.CHARACTER_ATTACK_STARTED
        break;
      }

      case GameCommands.RUN: {
        actionEvent =  GameEvents.CHARACTER_RUN_STARTED
        break
      }

      case GameCommands.LOOK: {
        actionEvent = GameEvents.LOOK_STARTED
        break
      }

      case GameCommands.REST: {
        actionEvent = GameEvents.REST_STARTED
        break;
      }

      case GameCommands.CHANGE_SCREEN: {
        actionEvent = GameEvents.CHANGE_SCREEN_STARTED
        break;
      }

      case GameCommands.START_DUNGEON: {
        actionEvent = GameEvents.DUNGEON_STARTED
        break;
      }

      case GameCommands.BUY_ITEM: {
        actionEvent = GameEvents.ITEM_BOUGHT
        break;
      }

      case GameCommands.EQUIP_ITEM: {
        actionEvent = GameEvents.ITEM_EQUIPPED
        break;
      }

      case GameCommands.UNEQUIP_ITEM: {
        actionEvent = GameEvents.ITEM_UNEQUIPPED
        break;
      }

      case GameCommands.STOP_DUNGEON: {
        actionEvent = GameEvents.DUNGEON_STOPPED
        break
      }
    }

    return actionEvent
  }
}
