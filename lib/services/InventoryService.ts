import StreamEvent from "@/lib/streams/StreamEvent";
import {isValidEvent} from "@/lib/streams/utils";
import {InventoryEvents} from "@/lib/utils/GameEvents";
import Inventory from "@/lib/game/Inventory";

export default class InventoryService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValidEvent(data, InventoryEvents)) {
      const inventory = await new Inventory(data.userId).load()
      await inventory.handleEvent(data.event, data.payload)
    }
  }
}
