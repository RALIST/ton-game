import GameObject from "@/src/domain/entities/GameObject/GameObject";
import Player from "@/src/domain/entities/Player/Player";
import Character from "@/src/domain/entities/Character/Character";

interface Routes {
  [key: number]: Route
}

export const gRoutes: Routes = {}

export default class Route extends GameObject {
  difficulty: number
  participants: Player[]
  characters: Character[]

  public static async initialize() {
    console.log("Routes initialize")
    const _route = new Route()
    _route.name = "Basic"
    _route.difficulty = 1

    gRoutes[0] = _route
  }

  constructor() {
    super();
    this.participants = []
    this.characters = []
    this.difficulty = 1
  }

  start() {
    const success = Math.random() > 0.5;
    if (success) this.stop()

    this.start()
  }

  addParticipant(player: Player) {
    this.participants.push(player)
    this.save()
  }

  addCharacter(char: Character) {
    this.characters.push(char)
    this.save()
  }

  stop() {
    this.participants.forEach(participant => participant.levelUp());
    this.save()
  }
}
