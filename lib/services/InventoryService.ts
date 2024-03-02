import StreamEvent from "@/lib/streams/StreamEvent";
import {isValidEvent} from "@/lib/streams/utils";
import {InventoryEvents, RendererEvents} from "@/lib/utils/gameEvents";
import GameRenderer from "@/lib/GameRenderer";
import Inventory from "@/lib/Inventory";

export default class InventoryService {
  public static async handleEvent(message: any) {
    const data: StreamEvent = JSON.parse(message.message)
    if(isValidEvent(data, InventoryEvents)) {
      const inventory = await new Inventory(data.userId).load()
      await inventory.handleEvent(data.event, data.payload)
    }
  }
}
