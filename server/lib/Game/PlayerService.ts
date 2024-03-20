import BaseService from "@/lib/Game/BaseService";
import Player from "@/lib/Player/Player";
import Character from "@/lib/Character/Character";

export default class PlayerService extends BaseService {
  public static async consume(data: any) {
    const character = await new Player(data.userId).load()
    const instance = new PlayerService(character)
    await instance.handleEvent(data)
  }

  constructor(model: Character) { super(model) }

  private eventHandlers = {}
}
