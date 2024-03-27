import {IService} from "@/src/infrostructure/services/types";
import EventBus from "@/src/infrostructure/services/EventBus";
import EventHandlerService from "@/src/infrostructure/services/EventHandlerService";
import RedisService from "@/src/infrostructure/services/RedisService";
import GameService from "@/src/infrostructure/services/GameService";
import WebSocketService from "@/src/infrostructure/services/WebSocketService";
import Performer from "@/src/infrostructure/services/Performer";

export default class Application {
  static services: IService[] = [];

  static async start(){
    try {
      const redisService = new RedisService()
      const gameService = new GameService()
      const eventBus = new EventBus()
      const eventHandlerService = new EventHandlerService(eventBus)
      const performer = new Performer(eventBus)
      const wsService = new WebSocketService(performer)

      this.services = [
        redisService,
        gameService,
        eventBus,
        eventHandlerService,
        wsService
      ]

      await this.startServices()

    } catch (error) {
      await this.stop()
    }
  }

  static async startServices() {
    for (const service of this.services) { await service.start() }
  }

  static async stop() {
    for (const service of this.services.reverse()) { await service.stop() }
  }
}
