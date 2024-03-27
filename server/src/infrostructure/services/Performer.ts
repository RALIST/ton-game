import {RawData} from "ws";
import {ActionCommands} from "@/src/domain/entities/Game/GameCommands";
import EventBus from "@/src/infrostructure/services/EventBus";
import MoveRequested from "@/src/events/player/MoveRequested";
import GameEvent from "@/src/events/GameEvent";
import AttackRequested from "@/src/events/player/AttackRequested";
import RunRequested from "@/src/events/player/RunRequested";
import LookRequested from "@/src/events/player/LookRequested";
import TalkRequested from "@/src/events/player/TalkRequested";
import RouteStartRequested from "@/src/events/routes/RouteStartRequested";
import ActionCompleted from "@/src/events/renderer/ActionCompleted";

type IncomingMessage = {
  action: string,
  userId: number,
  payload: any
}

export default class Performer {
  eventBus: EventBus

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  public async handleIncomingMessage(message: RawData) {
    const data: IncomingMessage = JSON.parse(message.toString());
    if (!data || !data.action || !data.userId ) return;
    const availableCommands = Object.values(ActionCommands) as string[]
    if (!availableCommands.includes(data.action)) return;

    await this.performAction(data)
  }

  async performAction(data: IncomingMessage) {
    const eventClass = this.getEvent(data.action)
    if (!eventClass) return
    const actionEvent = new eventClass(data.userId, data.payload)
    if (actionEvent.isValid()) {
      this.eventBus.dispatch(actionEvent)
    } else {
      const completed = new ActionCompleted(data.userId, { result: false, error: "Incorrect params" })
      this.eventBus.dispatch(completed)
    }
  }

  getEvent(action: string) {
    const events: {[key: string]: typeof GameEvent} = {
      [ActionCommands.MOVE]: MoveRequested,
      [ActionCommands.ATTACK]: AttackRequested,
      [ActionCommands.RUN]: RunRequested,
      [ActionCommands.LOOK]: LookRequested,
      [ActionCommands.TALK]: TalkRequested,
      [ActionCommands.START_ROUTE]: RouteStartRequested
    }

    return events[action]
  }
}
