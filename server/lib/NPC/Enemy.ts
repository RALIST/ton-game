export default class Enemy {
  id: number
  name: string
  attack: number
  defence: number

  constructor(id: number, name: string, attack: number, defence: number) {
    this.id = id
    this.name = name
    this.attack = attack
    this.defence = defence
  }
}
