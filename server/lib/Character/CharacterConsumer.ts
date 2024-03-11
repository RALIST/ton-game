import {CharacterEvents} from "@/lib/utils/GameEvents";
import CharacterService from "@/lib/Character/CharacterService";
import StreamEvent from "@/lib/utils/streams/StreamEvent";
import {isValidEvent, listenToStream} from "@/lib/utils/streams/utils";

export default class CharacterConsumer {
  private static events = CharacterEvents
  private static service = CharacterService

  public static async start() {
    console.log("Character consumer started!")

    const events = CharacterConsumer.events
    await listenToStream((message) => {
      const data: StreamEvent = JSON.parse(message.message);

      if (isValidEvent(data, events)) this.service.consume(data);
    }, ["gameplay"])
  }
}
