import Player from "@/src/domain/entities/Player/Player";
import Stat from "@/src/domain/entities/Stat/Stat";
import Attribute from "@/src/domain/entities/Attribute/Attribute";
import Skill from "@/src/domain/entities/Skill/Skill";
import Perk from "@/src/domain/entities/Perk/Perk";
import Trait from "@/src/domain/entities/Trait/Trait";
import Item from "@/src/domain/entities/Item/Item";
import Route from "@/src/domain/entities/Route/Route";
import Character from "@/src/domain/entities/Character/Character";
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

    for (const player of gPlayers.values()) { await player.save() }
    gPlayers.clear()

    console.log("Game service stopped!")
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
