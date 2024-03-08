export default class Item {
  id: number
  name: string
  itemType!: string
  description: string
  stackable!: boolean
  equipable!: boolean
  tradeable!: boolean
  usable!: boolean

  constructor(id: number, name: string, description: string) {
    this.id = id
    this.description = description
    this.name = name
    this.stackable = false
    this.usable = false
    this.tradeable = false
    this.equipable = false
  }
}
