import StreamEvent from "@/lib/streams/StreamEvent";
import {isValidEvent} from "@/lib/streams/utils";
import {LoggerEvents} from "@/lib/utils/gameEvents";
import {GameLogger} from "@/lib/GameLogger";


export default class GameLoggerService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValidEvent(data, LoggerEvents)) {
      const logger = await new GameLogger(data.userId).load()
      await logger.handleEvent(data.event, data.payload)
    }
  }
}
