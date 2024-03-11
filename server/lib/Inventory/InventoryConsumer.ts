import {InventoryEvents} from "@/lib/utils/GameEvents";
import InventoryService from "@/lib/Inventory/InventoryService";
import {isValidEvent, listenToStream} from "@/lib/utils/streams/utils";
import StreamEvent from "@/lib/utils/streams/StreamEvent";

export default class InventoryConsumer {
  private static events = InventoryEvents;

  public static async start() {
    console.log("Inventory consumer started!")

    const events = InventoryConsumer.events
    await listenToStream((message) => {
      const data: StreamEvent = JSON.parse(message.message);

      if (isValidEvent(data, events)) InventoryService.consume(data);
    }, ["gameplay"])
  }
}
