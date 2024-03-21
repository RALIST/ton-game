import Stat from "@/lib/Stat/Stat";
import Attribute from "@/lib/Attribute/Attribute";
import Skill from "@/lib/Skill/Skill";
import Perk from "@/lib/Perk/Perk";
import Trait from "@/lib/Trait/Trait";
import Item from "@/lib/Item/Item";
import Route from "@/lib/Route/Route";
import Character from "@/lib/Character/Character";
import Player from "@/lib/Player/Player";

export const gPlayers = new Map<number, Player>();
export const gIntervals = new Set<NodeJS.Timeout>()

export default class Game {
  public static async initialize() {
    console.log("Game is initializing...")
    // global objects initializer
    await Stat.initialize()
    await Attribute.initialize()
    await Skill.initialize()
    await Perk.initialize()
    await Trait.initialize()
    await Item.initialize()
    await Route.initialize()
    await Character.initialize()

    this.startGameLoops()

    console.log("Game initialized!")
  }

  public static async getCurrentPlayer(userId: number) {
    let player = gPlayers.get(userId)

    if (!player) {
      player = await new Player(userId).load()
      gPlayers.set(userId, player)
    }

    return player
  }

  private static startGameLoops() {
    const gameTimeInterval = setInterval(() => {
    },120) // update internal game time

    const hpRecoveryInterval = setInterval(() => {
      gPlayers.forEach(player => player.healOverTime())
    }, 1000) // hp recovery loop

    const edRecoveryInterval = setInterval(() => {
      gPlayers.forEach(player => { player.healOverTime() })
    }, 1000) // endurance recovery

    gIntervals.add(hpRecoveryInterval)
    gIntervals.add(edRecoveryInterval)
    gIntervals.add(gameTimeInterval)
  }
}
