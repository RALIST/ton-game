import Inventory from "@/lib/game/Inventory";
import StreamEvent from "@/lib/streams/StreamEvent";
import {InventoryEvents} from "@/lib/utils/GameEvents";
import Item from "@/lib/game/Item";
import InventoryItems, {InventoryItemData} from "@/lib/game/InventoryItems";
import InventoryRepository from "@/lib/repositories/InventoryRepository";

export default class InventoryService {
  model: Inventory

  public static async consume(data: any) {
    const model = await new Inventory(data.userId).load()
    const instance = new InventoryService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Inventory) {
    this.model = model
  }

  async handleEvent(data: StreamEvent) {
    const { event, payload } = data
    // @ts-ignore
    if (event in this.eventHandlers) await this.eventHandlers[event](payload);
  }

  private eventHandlers = {
    [InventoryEvents.ITEM_ADDED]: async ({item}: {item: InventoryItemData}) => {
      await this.model.repo.append("items", item)
    }
  }
}
