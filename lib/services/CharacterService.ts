import Character from "@/lib/game/Character";
import StreamEvent from "@/lib/streams/StreamEvent";
import {CharacterEvents} from "@/lib/utils/GameEvents";

export default class CharacterService {
  model: Character

  public static async consume(data: StreamEvent) {
    const character = await Character.initialize(data.userId)
    const instance = new CharacterService(character)
    await instance.handleEvent(data)
  }

  constructor(model: Character) {
    this.model = model
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    if (event in this.eventHandlers) { // @ts-ignore
      await this.eventHandlers[event](payload);
    }
  }

  private eventHandlers = {
    [CharacterEvents.CHARACTER_MOVE_STARTED]: async (payload: any) => {
      // Add your custom logic dedicated to CHARACTER_MOVE_STARTED event here.
    },

    [CharacterEvents.CHARACTER_ATTACK_STARTED]: async (payload: any) => {
      // Add your custom logic dedicated to CHARACTER_ATTACK_STARTED event here.
    },

    [CharacterEvents.CHARACTER_RUN_STARTED]: async (payload: any) => {
      // Add your custom logic dedicated to CHARACTER_RUN_STARTED event here.
    },

    [CharacterEvents.ENEMIES_FOUND]: async (payload: any) => {
      // Add your custom logic dedicated to ENEMIES_FOUND event here.
    },

    [CharacterEvents.CHARACTER_ATTRIBUTES_CHANGED]: async (payload: any) => {
      // Add your custom logic dedicated to CHARACTER_ATTRIBUTES_CHANGED event here.
    },

    [CharacterEvents.RANDOM_EVENT_FOUND]: async (payload: any) => {
      // Add your custom logic dedicated to RANDOM_EVENT_FOUND event here.
    },

    [CharacterEvents.REST_STARTED]: async (payload: any) => {
      // Add your custom logic dedicated to REST_STARTED event here.
    },

    [CharacterEvents.CHARACTER_ACTION_COMPLETED]: async (payload: any) => {
      // Add your custom logic dedicated to CHARACTER_ACTION_COMPLETED event here.
    },
  }
}
