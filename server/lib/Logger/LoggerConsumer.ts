import {LoggerEvents} from "@/lib/utils/GameEvents";
import LoggerService from "@/lib/Logger/LoggerService";
import StreamEvent from "@/lib/utils/streams/StreamEvent";
import {isValidEvent, listenToStream} from "@/lib/utils/streams/utils";

export default class LoggerConsumer {
  private static events = LoggerEvents

  public static async start() {
    console.log("Logger consumer started!")

    const events = LoggerConsumer.events
    await listenToStream((message) => {
      const data: StreamEvent = JSON.parse(message.message);

      if (isValidEvent(data, events)) LoggerService.consume(data);
    }, ["gameplay"])
  }
}
