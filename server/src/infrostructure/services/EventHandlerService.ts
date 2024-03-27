import {IService} from "@/src/infrostructure/services/types";
import PlayerHandler from "@/src/infrostructure/eventHandlers/PlayerHandler";
import EventBus from "@/src/infrostructure/services/EventBus";
import InventoryHandler from "@/src/infrostructure/eventHandlers/InventoryHandler";
import LoggerHandler from "@/src/infrostructure/eventHandlers/LoggerHandler";

export default class EventHandlerService implements IService {
  private readonly eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  async start() {
    PlayerHandler.init(this.eventBus);
    InventoryHandler.init(this.eventBus)
    LoggerHandler.init(this.eventBus)
  }

  async stop() {}
}
