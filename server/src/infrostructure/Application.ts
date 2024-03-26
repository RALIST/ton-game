import {IService} from "@/src/infrostructure/services/types";

export default class Application {
  static services: IService[] = [];

  static async start(){
    try {
      for (const service of this.services) { await service.start() }
    } catch (error) {
      await this.stop()
    }
  }

  static async stop() {
    for (const service of this.services.reverse()) { await service.stop() }
  }

  static registerService(service: IService) {
    this.services.push(service)
  }
}
