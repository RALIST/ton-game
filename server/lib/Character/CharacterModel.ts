import {GameCommands} from "@/lib/utils/GameCommands";
import CharacterRepository from "@/lib/Character/CharacterRepository";
import characterData from "./data/character.json"
import GameMap from "@/lib/Dungeon/GameMap";
import {DungeonLocation} from "@/lib/Dungeon/DungeonLocation";
import Attributes from "@/lib/Character/Attributes";
import Perks from "@/lib/Character/Perks";
import Skills from "@/lib/Character/Skills";

import type {CharacterAttribute, CharacterSkill, Perk, Character} from "@/lib/Character/types";

export default class CharacterModel {
  userId: number;
  name!: string;
  maxHealth!: number;
  currentHealth!: number;
  endurance!: number;
  maxEndurance!: number;
  balance!: number;
  currentLocationId!: number;
  status!: "inVillage" | "inDungeon";
  dungeon_status!: "idle" | "inBattle" | "tired" | "dead" | "returning" | "looked";
  peacezone_status!: "idle";
  skills!: CharacterSkill[]; // skills ids
  perks!: Perk[]; // perks ids
  attributes!: CharacterAttribute[];
  repo: CharacterRepository;

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
    const data = await this.repo.loadCharacterData()
    this.initializeCharacterData(data)
    if (!data) await this.repo.dump(this as Character)

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
    this.status = data?.status ?? "inVillage";
    this.peacezone_status = data?.peacezone_status ?? "idle";
    this.dungeon_status = data?.dungeon_status ?? "idle";
    this.skills = Skills.initialize(data?.skills);
    this.perks = Perks.initialize(data?.perks);
    this.attributes = Attributes.initialize(data?.attributes);
  }

  private actionLookup = {
    inDungeon: {
      idle: [GameCommands.MOVE, GameCommands.LOOK, GameCommands.STOP_DUNGEON],
      inBattle: [GameCommands.ATTACK, GameCommands.DEFENCE, GameCommands.RUN],
      tired: [GameCommands.REST],
      dead: [GameCommands.REST],
      looked: [GameCommands.MOVE],
      default: [],
    },
    inVillage: {
      idle: [
        GameCommands.SHOP_SCENE,
        GameCommands.BAR_SCENE,
        GameCommands.WAREHOUSE_SCENE,
        GameCommands.HOME_SCENE,
        GameCommands.START_DUNGEON_SCENE,
        GameCommands.BANK_SCENE
      ],
      default: [],
    },
  };

  get getAvailableAction(): string[] {
    const subStatus = this.status === 'inDungeon' ? this.dungeon_status : this.peacezone_status;
    //@ts-expect-error idk
    return (this.actionLookup[this.status][subStatus] || this.actionLookup[this.status].default || []) as string[];
  }

  async getCurrentLocation(): Promise<DungeonLocation | undefined> {
    const map = await new GameMap().load();
    return map.locations.find(location => location.id == this.currentLocationId)
  }
}
