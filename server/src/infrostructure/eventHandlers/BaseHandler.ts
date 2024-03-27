import EventBus from "@/src/infrostructure/services/EventBus";

export default class BaseHandler {
  readonly eventBus: EventBus

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }
}
