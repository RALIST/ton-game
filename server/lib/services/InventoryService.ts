import Inventory from "@/lib/game/Inventory";
import {InventoryEvents} from "@/lib/utils/GameEvents";
import {SceneCommands} from "@/lib/utils/GameCommands";
import BaseService from "@/lib/services/BaseService";
import type {InventoryItem} from "@/types/gameplay";

export default class InventoryService extends BaseService{
  public static async consume(data: any) {
    const model = await new Inventory(data.userId).load()
    const instance = new InventoryService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Inventory) { super(model) }

  private eventHandlers = {
    [InventoryEvents.ITEM_ADDED]: async (inventoryItem: InventoryItem) => {
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
