import Logger from "@/lib/Game/Logger";
import BaseService from "@/lib/Game/BaseService";

export default class LoggerService extends BaseService {
  public static async consume(data: any) {
    console.log("Logger service handling event:", data)
    const model = await new Logger(data.userId).load()
    const instance = new LoggerService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Logger) {super(model)}

  private eventHandlers = {}
}
