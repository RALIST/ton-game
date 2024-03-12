import InventoryModel from "@/lib/Inventory/InventoryModel";
import {InventoryEvents} from "@/lib/utils/GameEvents";
import {VillageScenes} from "@/lib/utils/GameCommands";
import BaseService from "@/lib/utils/services/BaseService";
import {InventoryItem} from "@/lib/Inventory/types";

export default class InventoryService extends BaseService{
  public static async consume(data: any) {
    const model = await new InventoryModel(data.userId).load()
    const instance = new InventoryService(model)
    await instance.handleEvent(data)
  }

  constructor(model: InventoryModel) { super(model) }

  private eventHandlers = {
    [InventoryEvents.ITEM_ADDED]: async (inventoryItem: InventoryItem) => {
      await this.model.addItem(inventoryItem)
    },

    [InventoryEvents.ITEM_EQUIPPED]: async ({itemId}: {itemId: number}) => {
      await this.model.equip(itemId)
      await this.streamEvent.actionCompleted(this.model.userId, {scene: VillageScenes.INVENTORY_SCENE}).send()
    },

    [InventoryEvents.ITEM_UNEQUIPPED]: async ({itemId}: {itemId: number}) => {
      await this.model.unequip(itemId)
      await this.streamEvent.actionCompleted(this.model.userId, {scene: VillageScenes.INVENTORY_SCENE}).send()
    }
  }
}
