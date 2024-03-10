import Item from "@/lib/game/Item";

export default class Supply extends Item {
  constructor(id: number, name: string, description: string) {
    super(id, name, description);

    this.itemType = "medicine"
    this.usable = false
    this.equipable = false
    this.stackable = true
    this.tradeable = true
  }
}
