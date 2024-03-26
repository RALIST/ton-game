import Player from "@/lib/Player/Player";
import {gAttributes} from "@/lib/Attribute/Attribute";
import {gStats} from "@/lib/Stat/Stat";

export default class PlayerRenderer {
  userId: number

  constructor(userId: number) {
    this.userId = userId
  }

  async render() {
    return {
      traits: [],
      perks: [],
      skills: [],
    }
  }

  renderPlayerAttributes(player: Player) {
    return Object.values(gAttributes).map((attr) => {
      return { name: attr.name, value: player.getAttribute(attr.id)}
    })
  }

  renderPlayerStats(player: Player) {
    return Object.values(gStats).map(stat => {
      return { name: stat.name, value: player.getStat(stat.id)}
    })
  }
}
