export default class Item {
  id: number
  name: string
  itemType: string
  description: string

  constructor(id: number, name: string,  itemType: string, description: string) {
    this.id = id
    this.description = description
    this.name = name
    this.itemType = itemType
  }
}
