enum TraitType {
  TRAIT_FAST_METABOLISM,
  TRAIT_BRUISER,
  TRAIT_SMALL_FRAME,
  TRAIT_ONE_HANDER,
  TRAIT_FINESSE,
  TRAIT_KAMIKAZE,
  TRAIT_HEAVY_HANDED,
  TRAIT_FAST_SHOT,
  TRAIT_BLOODY_MESS,
  TRAIT_JINXED,
  TRAIT_GOOD_NATURED,
  TRAIT_CHEM_RELIANT,
  TRAIT_CHEM_RESISTANT,
  TRAIT_SEX_APPEAL,
  TRAIT_SKILLED,
  TRAIT_GIFTED,
  TRAIT_COUNT,
}

interface TraitList {
  [key: number]: Trait
}

export const gTraits: TraitList = {}

export default class Trait {
  id!: number
  name!: string
  description!: string

    public static async initialize() {
    console.log("Traits init")
      for(const traitId in Object.values(TraitType)) {
        if(!(TraitType[traitId] === undefined)) {
          gTraits[traitId] = new Trait()
        }
      }
    }
}
