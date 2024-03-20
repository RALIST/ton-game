import BaseService from "@/lib/Game/BaseService";
import Inventory from "@/lib/Inventory/Inventory";

export default class InventoryService extends BaseService{
  public static async consume(data: any) {
    const model = new Inventory()
    const instance = new InventoryService(model)
    await instance.handleEvent(data)
  }

  constructor(model: Inventory) { super(model) }
  private eventHandlers = {}
}
