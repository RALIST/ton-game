export class GameLocation {
  name: string
  id: number
  desc: string

  constructor(id: number, name: string, desc: string) {
    this.name = name
    this.id = id as number
    this.desc = desc
  }
}
