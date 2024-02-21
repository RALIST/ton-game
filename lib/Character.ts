import {Dispatch} from "redux";

export type Action = {
  name: string,
  callback: () => void,
}

export class Character {
  userId: number;
  name!: string;
  health!: number[];
  endurance!: number;
  balance!: number;
  location!: string
  availableActions!: Action[];
  dispatch: Dispatch

  constructor(id: number, dispatch: Dispatch) {
    this.userId = id
    this.dispatch = dispatch
  }

  move() {
    this.dispatch({type: "Moved"})
  }

  look() {
    this.dispatch({type: "Looked"})
  }

  init(): this {
    // find character in DB and return initiated class
    // prisma.character.findUniq({where: userId: this.userId})
    this.name = "Best character"
    this.health = [100, 400]
    this.endurance = 100
    this.balance = 100_000
    this.location = "Пустынные пустоши!"
    this.availableActions = [
      {
        name: "Идти дальше",
        callback: () => this.move()
      },
      {
        name: "Осмотрется",
        callback: () => this.look()
      }
    ]
    return this
  }
}
