import GameObject from "@/lib/GameObject/GameObject";
import Player from "@/lib/Player/Player";
import Character from "@/lib/Character/Character";

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
