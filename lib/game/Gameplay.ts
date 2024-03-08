import StreamEvent from "@/lib/streams/StreamEvent";

export default class Gameplay {
  userId: number;

  constructor(userId: number) {
    this.userId = userId
  }

  async handleCharacterLook() {
    const streamEvent = new StreamEvent()

  }
}
