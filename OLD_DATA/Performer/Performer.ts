import {GameEvents} from "@/lib/Game/GameEvents";
import {GameCommands} from "@/lib/Game/GameCommands";
import StreamEvent from "@/lib/utils/streams/StreamEvent";
import {RawData} from "ws";
import CharacterState from "@/lib/Character/state/CharacterState";
import GameRenderer from "@/lib/Renderer/GameRenderer";

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
        const renderer = new GameRenderer(data.initData.user.id)
        await renderer.render({scene: data.scene})
      }
    }
  }

  async performAction(action: string, payload: any) {
    const availableCommands = Object.values(GameCommands) as string[]
    if (!availableCommands.includes(action)) return;

    const characterState = await new CharacterState(this.userId).load()
    if(!characterState.availableActions.includes(action)) return;

    if (action === GameCommands.CHANGE_SCENE) {
      if (!payload.scene) return
      if (!characterState.availableScenes.includes(payload.scene)) return
    }

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

      case GameCommands.CHANGE_SCENE: {
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
