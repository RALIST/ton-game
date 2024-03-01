import StreamEvent from "@/lib/streams/StreamEvent";
import {isValidEvent} from "@/lib/streams/utils";
import {GeneratorEvents} from "@/lib/utils/gameEvents";
import {EventGenerator} from "@/lib/EventGenerator";

export default class EventGeneratorService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValidEvent(data, GeneratorEvents)) {
      const generator = new EventGenerator(data.userId)
      await generator.handleEvent(data.event, data.payload)
    }
  }
}
