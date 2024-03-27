import {RawData} from "ws";
import {GameCommands} from "@/src/domain/entities/Game/GameCommands";
import {GameEvents} from "@/src/domain/entities/Game/GameEvents";
import Renderer from "@/src/domain/entities/Game/Renderer";

export default class Performer {
  userId: number
  constructor(userId: number) {
    this.userId = userId
  }

  public static async handleIncomingMessage(message: RawData) {
    const data = JSON.parse(message.toString())

    if (data) {
      if (data.action) {
        const performer = new Performer(data.userId)
        await performer.performAction(data.action, data.payload)
      }

      if (data.initData) {
        // TODO: upsert user here
        const renderer = new Renderer(data.initData.user.id)
        await renderer.render({scene: data.scene})
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async performAction(action: string, _payload: any) {
    const availableCommands = Object.values(GameCommands) as string[]
    if (!availableCommands.includes(action)) return;

    const actionEvent = this.detectEvent(action)
    const availableEvents = Object.values(GameEvents) as string[]
    if(!availableEvents.includes(actionEvent)) return

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

      case GameCommands.CHANGE_SCENE: {
        actionEvent = GameEvents.CHANGE_SCREEN_STARTED
        break;
      }

      case GameCommands.START_ROUTE: {
        actionEvent = GameEvents.ROUTE_STARTED
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

      case GameCommands.STOP_ROUTE: {
        actionEvent = GameEvents.ROUTE_STOPPED
        break
      }
    }

    return actionEvent
  }
}
