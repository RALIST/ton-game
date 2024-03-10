import perksData  from "@/lib/data/perks.json"
import Perk from "@/lib/game/Perk";

export default class Perks {
  static initialize(initData?: Perk[]) {
    if (initData) return initData

    const perkId: number = perksData[Math.floor(Math.random() * perksData.length)].id
    return perksData.filter(perk => perkId === perk.id)
  }
}
