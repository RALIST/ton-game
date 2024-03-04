import StreamEvent from "@/lib/streams/StreamEvent";
import {isValidEvent} from "@/lib/streams/utils";
import {GameplayEvents} from "@/lib/utils/GameEvents";
import {Gameplay} from "@/lib/game/Gameplay";

export default class GameplayService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValidEvent(data, GameplayEvents)) {
      const generator = new Gameplay(data.userId)
      await generator.handleEvent(data.event, data.payload)
    }
  }
}
