export default class Item {
  id: number
  name: string
  rarity: string
  itemType: string
  description: string

  constructor(id: number, name: string, rarity: string, itemType: string, description: string) {
    this.id = id
    this.description = description
    this.name = name
    this.rarity = rarity
    this.itemType = itemType
  }
}
