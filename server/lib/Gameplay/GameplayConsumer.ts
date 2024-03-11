import {GameplayEvents} from "@/lib/utils/GameEvents";
import GameplayService from "@/lib/Gameplay/GameplayService";
import StreamEvent from "@/lib/utils/streams/StreamEvent";
import {isValidEvent, listenToStream} from "@/lib/utils/streams/utils";

export default class GameplayConsumer {
  private static events = GameplayEvents

  public static async start() {
    console.log("Gameplay consumer started!")

    const events = GameplayConsumer.events
    await listenToStream((message) => {
      const data: StreamEvent = JSON.parse(message.message);

      if (isValidEvent(data, events)) GameplayService.consume(data);
    }, ["gameplay"])
  }
}
