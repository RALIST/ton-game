import Character from "@/lib/game/Character";
import StreamEvent from "@/lib/streams/StreamEvent";
import {CharacterEvents} from "@/lib/utils/GameEvents";
import GameMap from "@/lib/game/GameMap";
import {ShopItem} from "@/lib/game/Shop";
import {InventoryItemData} from "@/lib/game/InventoryItems";
import {SceneCommands} from "@/lib/utils/GameCommands";

export default class CharacterService {
  model: Character
  streamEvent: StreamEvent

  public static async consume(data: StreamEvent) {
    const character = await Character.initialize(data.userId)
    const instance = new CharacterService(character)
    await instance.handleEvent(data)
  }

  constructor(model: Character) {
    this.model = model
    this.streamEvent = new StreamEvent()
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    if (event in this.eventHandlers) { // @ts-ignore
      await this.eventHandlers[event](payload);
    }
  }

  private eventHandlers = {
    [CharacterEvents.CHARACTER_MOVE_STARTED]: async (payload: any) => {
      const map = await new GameMap().load()
      let nextLocationId = this.model.currentLocationId + 1

      if (nextLocationId > map.locations.length) {
        await this.streamEvent.dungeonStopped(this.model.userId, {}).send()
        return;
      }

      await this.model.repo.update({currentLocationId: nextLocationId})
      await this.streamEvent.moveCompleted(this.model.userId, {}).send()
      await this.streamEvent.actionCompleted(this.model.userId, {}).send()
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
    [CharacterEvents.DUNGEON_STARTED]: async (payload: any) => {
      await this.model.repo.update({currentLocationId: 1})
      await this.model.repo.update({status: "inDungeon"})
      await this.streamEvent.actionCompleted(this.model.userId, {}).send()
    },
    [CharacterEvents.DUNGEON_STOPPED]: async (payload: any) => {
      await this.model.repo.update({currentLocationId: 0})
      await this.model.repo.update({status: "inVillage"})
      await this.streamEvent.actionCompleted(this.model.userId, {}).send()
    },
    [CharacterEvents.ITEM_BOUGHT]: async (payload: any) => {
      const shopItem: ShopItem = payload.item
      const newBalance = this.model.balance - shopItem.price
      if (newBalance < 0) {
        await this.streamEvent.actionCompleted(this.model.userId, {scene: SceneCommands.SHOP_SCENE}).send()
        return
      }

      await this.model.repo.update({balance: newBalance})
      const newPayload: InventoryItemData = { item: shopItem.item, count: 1 }
      await this.streamEvent.itemAdded(this.model.userId, newPayload).send()
      await this.streamEvent.actionCompleted(this.model.userId, {scene: SceneCommands.SHOP_SCENE}).send()
    }
  }
}
