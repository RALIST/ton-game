import {GameCommands} from "@/lib/utils/GameCommands";
import Skills, {CharacterSkill} from "@/lib/game/character/Skills";
import Attributes, {CharacterAttribute} from "@/lib/game/character/Attributes";
import Perks from "@/lib/game/character/Perks";
import Perk from "@/lib/game/Perk";
import CharacterRepository from "@/lib/repositories/CharacterRepository";

import characterData from "../data/character.json"
import GameMap from "@/lib/game/GameMap";
import {DungeonLocation} from "@/lib/game/DungeonLocation";

export type CharacterData = {
  currentHealth: number,
  maxHealth: number,
  endurance: number,
  maxEndurance: number,
  balance: number,
  name: string,
  currentLocationId: number,
  status: "inVillage" | "inDungeon",
  peacezone_status: "idle",
  dungeon_status: "idle" | "inBattle" | "tired" | "dead" | "returning" | "looked",
  skills: CharacterSkill[],
  perks: Perk[],
  attributes: CharacterAttribute[]
};

export default class Character {
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

  public static async initialize(userId: number): Promise<Character> {
    return await new Character(userId).load();
  }

  // find character in DB and return initiated class
  async load() {
    const data = await this.repo.loadCharacterData()
    this.initializeCharacterData(data)
    if (!data) await this.repo.dump(this as CharacterData)

    return this
  }

  initializeCharacterData(data: CharacterData) {
    this.currentHealth = data?.currentHealth ?? characterData.health[0];
    this.endurance = data?.endurance ?? characterData.endurance;
    this.maxEndurance = data?.endurance ?? characterData.maxEndurance;
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
      inBattle: [GameCommands.ATTACK, GameCommands.DEFENCE, GameCommands.USE_ITEM, GameCommands.RUN],
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

  getAvailableAction(): string[] {
    const subStatus = this.status === 'inDungeon' ? this.dungeon_status : this.peacezone_status;
    //@ts-ignore
    return (this.actionLookup[this.status][subStatus] || this.actionLookup[this.status].default || []) as string[];
  }

  async getCurrentLocation(): Promise<DungeonLocation | undefined> {
    const map = await new GameMap().load();
    return map.locations.find(location => location.id == this.currentLocationId)
  }
}
