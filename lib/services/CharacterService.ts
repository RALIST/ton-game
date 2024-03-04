import StreamEvent from "@/lib/streams/StreamEvent";
import {Character} from "@/lib/game/Character";
import {isValidEvent} from "@/lib/streams/utils";
import {CharacterEvents} from "@/lib/utils/GameEvents";

export default class CharacterService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)

    if(isValidEvent(data, CharacterEvents)) {
      const character = await new Character(data.userId).load()
      await character.handleEvent(data.event, data.payload)
    }
  }
}
