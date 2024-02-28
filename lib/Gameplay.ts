export class Gameplay {
  userId: number;
  pushStream!: string;

  constructor(userId: number) {
    this.pushStream = "gameplay"
    this.userId = userId
  }
}
