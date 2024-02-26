import {EventStore} from "@/lib/EventStore";

export default async function emitEvent(event: string, payload: any, stream: string) {
  const eventStore = await new EventStore(payload.userId).load();
  await eventStore.emitEvent(event, payload, stream)
}
