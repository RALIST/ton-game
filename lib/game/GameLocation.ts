export class GameLocation {
  name: string
  id: number
  desc: string
  type: string

  constructor(id: number, name: string, desc: string, type: string) {
    this.name = name
    this.id = id as number
    this.desc = desc
    this.type = type
  }
}
