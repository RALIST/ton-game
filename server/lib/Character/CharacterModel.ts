import CharacterRepository from "@/lib/Character/CharacterRepository";
import characterData from "./data/character.json"
import GameMap from "@/lib/Dungeon/GameMap";
import {DungeonLocation} from "@/lib/Dungeon/DungeonLocation";
import Attributes from "@/lib/Character/Attributes";
import Perks from "@/lib/Character/Perks";
import Skills from "@/lib/Character/Skills";

import type {CharacterAttribute, CharacterSkill, Perk, Character} from "@/lib/Character/types";
import CharacterState from "@/lib/Character/state/CharacterState";

export default class CharacterModel {
  userId: number;
  name!: string;
  maxHealth!: number;
  currentHealth!: number;
  endurance!: number;
  maxEndurance!: number;
  balance!: number;
  currentLocationId!: number;
  skills!: CharacterSkill[];
  perks!: Perk[];
  attributes!: CharacterAttribute[];
  repo: CharacterRepository;
  state!: CharacterState

  constructor(id: number) {
    this.userId = id
    this.repo = new CharacterRepository(id)
    this.balance = 0
  }

  public static async initialize(userId: number): Promise<CharacterModel> {
    return await new CharacterModel(userId).load();
  }

  // find character in DB and return initiated class
  async load() {
    const data = await this.repo.load()
    this.initializeCharacterData(data)
    this.state = await new CharacterState(this.userId).load()

    if (!data) await this.repo.dump(this)

    return this
  }

  initializeCharacterData(data: Character) {
    this.currentHealth = data?.currentHealth ?? characterData.health[0];
    this.endurance = data?.endurance ?? characterData.endurance;
    this.maxEndurance = data?.maxEndurance ?? characterData.maxEndurance;
    this.maxHealth = data?.maxHealth ?? characterData.health[1];
    this.balance = data?.balance ?? characterData.balance ?? 0;
    this.name = data?.name ?? characterData.name;
    this.currentLocationId = data?.currentLocationId ?? 1;
    this.skills = Skills.initialize(data?.skills);
    this.perks = Perks.initialize(data?.perks);
    this.attributes = Attributes.initialize(data?.attributes);
  }

  async getCurrentLocation(): Promise<DungeonLocation | undefined> {
    const map = await new GameMap().load();
    return map.locations.find(location => location.id == this.currentLocationId)
  }
}
