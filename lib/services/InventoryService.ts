import Inventory from "@/lib/game/Inventory";
import StreamEvent from "@/lib/streams/StreamEvent";
import {InventoryEvents} from "@/lib/utils/GameEvents";
import Item from "@/lib/game/Item";
import InventoryItems, {InventoryItemData} from "@/lib/game/InventoryItems";
import InventoryRepository from "@/lib/repositories/InventoryRepository";
import {SceneCommands} from "@/lib/utils/GameCommands";
import BaseService from "@/lib/services/BaseService";

export default class InventoryService extends BaseService{
  public static async consume(data: any) {
    const model = await new Inventory(data.userId).load()
    const instance = new InventoryService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Inventory) { super(model) }

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
