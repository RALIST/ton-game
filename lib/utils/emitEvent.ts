import {EventStore} from "@/lib/utils/EventStore";
import StreamEvent from "@/lib/streams/StreamEvent";

export default async function emitEvent(data: StreamEvent, stream = "gameplay") {
  const eventStore = new EventStore(data.userId)
  await eventStore.emitEvent(data, stream)
}
