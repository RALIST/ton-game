import Stat from "@/lib/Stat/Stat";
import Attribute from "@/lib/Attribute/Attribute";
import Skill from "@/lib/Skill/Skill";
import Perk from "@/lib/Perk/Perk";
import Trait from "@/lib/Trait/Trait";
import Item from "@/lib/Item/Item";
import Route from "@/lib/Route/Route";
import Character from "@/lib/Character/Character";
import Player from "@/lib/Player/Player";
import {IService} from "@/src/infrostructure/services/types";

export const gPlayers = new Map<number, Player>();
export const gIntervals = new Set<NodeJS.Timeout>()

export default class GameService implements IService {

  public async start() {
    console.log("Game service is starting..")

    await Stat.initialize()
    await Attribute.initialize()
    await Skill.initialize()
    await Perk.initialize()
    await Trait.initialize()
    await Item.initialize()
    await Route.initialize()
    await Character.initialize()

    this.startGameLoops()

    console.log("Game service started!")
  }

  public async stop() {
    gIntervals.forEach(interval => clearInterval(interval))
    gIntervals.clear()

    gPlayers.forEach(async (player) => await player.save())
    gPlayers.clear()

    console.log("Game service stopped!")
  }

  public static async getCurrentPlayer(userId: number) {
    let player = gPlayers.get(userId)

    if (!player) {
      player = await new Player(userId).load()
      gPlayers.set(userId, player)
    }

    return player
  }

  private startGameLoops() {
    const gameTimeInterval = setInterval(() => {
    },120) // update internal game time

    const hpRecoveryInterval = setInterval(() => {
      gPlayers.forEach(player => player.healOverTime())
    }, 1000) // hp recovery loop

    const edRecoveryInterval = setInterval(() => {
      gPlayers.forEach(player => player.healOverTime())
    }, 1000) // endurance recovery

    gIntervals.add(hpRecoveryInterval)
    gIntervals.add(edRecoveryInterval)
    gIntervals.add(gameTimeInterval)
  }
}
