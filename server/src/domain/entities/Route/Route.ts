import GameObject from "@/src/domain/entities/GameObject/GameObject";
import Player from "@/src/domain/entities/Player/Player";
import Character from "@/src/domain/entities/Character/Character";

interface Routes {
  [key: number]: Route
}

export const gRoutes: Routes = {}

export default class Route extends GameObject {
  difficulty: number
  participants: Set<Player>
  characters: Set<Character>

  public static async initialize() {
    console.log("Routes initialize")
    const _route = new Route()
    _route.name = "Basic"
    _route.difficulty = 1
    _route.id = 1

    gRoutes[0] = _route
  }

  constructor() {
    super();
    this.participants = new Set()
    this.characters = new Set()
    this.difficulty = 1
  }

  reset() {
    this.participants.clear()
    this.characters.clear()
  }

  start() {
    const success = Math.random() > 0.5;
    if (success) { this.stop(); return }

    this.start()
  }

  addParticipant(player: Player) {
    this.participants.add(player)
    this.save()
  }

  addCharacter(char: Character) {
    this.characters.add(char)
    this.save()
  }

  stop() {
    this.participants.forEach(participant => participant.addExp(10000000));
    // this.save()
  }
}
