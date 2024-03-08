import Inventory from "@/lib/game/Inventory";
import StreamEvent from "@/lib/streams/StreamEvent";
import {InventoryEvents} from "@/lib/utils/GameEvents";
import Item from "@/lib/game/Item";
import InventoryItems, {InventoryItemData} from "@/lib/game/InventoryItems";
import InventoryRepository from "@/lib/repositories/InventoryRepository";
import {SceneCommands} from "@/lib/utils/GameCommands";

export default class InventoryService {
  model: Inventory
  streamEvent: StreamEvent

  public static async consume(data: any) {
    const model = await new Inventory(data.userId).load()
    const instance = new InventoryService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Inventory) {
    this.model = model
    this.streamEvent = new StreamEvent()
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    // @ts-ignore
    if (event in this.eventHandlers) await this.eventHandlers[event](payload);
  }

  private eventHandlers = {
    [InventoryEvents.ITEM_ADDED]: async (inventoryItem: InventoryItemData) => {
      await this.model.addItem(inventoryItem)
    },

    [InventoryEvents.ITEM_EQUIPPED]: async ({itemId}: {itemId: number}) => {
      await this.model.equip(itemId)
      await this.streamEvent.actionCompleted(this.model.userId, {scene: SceneCommands.INVENTORY_SCENE}).send()
    },

    [InventoryEvents.ITEM_UNEQUIPPED]: async ({itemId}: {itemId: number}) => {
      await this.model.unequip(itemId)
      await this.streamEvent.actionCompleted(this.model.userId, {scene: SceneCommands.INVENTORY_SCENE}).send()
    }
  }
}
