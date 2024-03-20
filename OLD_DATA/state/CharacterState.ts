import {DungeonScenes, GameCommands, VillageScenes} from "@/lib/Game/GameCommands";
import CharacterStateRepository from "@/lib/Character/state/CharacterStateRepository";

enum CharacterStatuses {
  IN_VILLAGE,
  IN_DUNGEON
}

enum CharacterDungeonStatuses {
  IDLE,
  IN_BATTLE,
  TIRED,
  DEAD,
  RETURNING
}

enum CharacterPeacefulStatuses {
  ""
}

export default class CharacterState {
  userId: number
  status!: keyof typeof CharacterStatuses
  dungeon_status!:keyof typeof CharacterDungeonStatuses
  peacezone_status!: keyof typeof CharacterPeacefulStatuses
  repo: CharacterStateRepository

  constructor(userId: number) {
    this.userId = userId
    this.repo = new CharacterStateRepository(userId)
  }

  async setStatus(toStatus: keyof typeof CharacterStatuses | keyof typeof CharacterDungeonStatuses | keyof typeof CharacterPeacefulStatuses) {
    if (Object.values(CharacterStatuses).includes(toStatus)) {
      await this.repo.update({status: toStatus})
      return;
    }

    if (Object.values(CharacterDungeonStatuses).includes(toStatus)) {
      await this.repo.update({dungeon_status: toStatus})
      return;
    }

    if (Object.values(CharacterPeacefulStatuses).includes(toStatus)) {
      await this.repo.update({peacezone_status: toStatus})
      return;
    }
  }

  async load() {
    const data = await this.repo.load()
    this.status = data?.status ?? "IN_VILLAGE"
    this.dungeon_status = data?.dungeon_status ?? "IDLE"
    this.peacezone_status = ""
    return this
  }

  // simple state machine
  // TODO: implement more complex stuff
  private actionLookup = {
    IN_DUNGEON: {
      IDLE: [GameCommands.MOVE, GameCommands.LOOK, GameCommands.STOP_DUNGEON],
      IN_BATTLE: [GameCommands.ATTACK, GameCommands.DEFENCE, GameCommands.RUN],
      TIRED: [GameCommands.REST],
      DEAD: [GameCommands.REST],
      default: [],
    },
    IN_VILLAGE: {
      default: [
        GameCommands.CHANGE_SCENE
      ]
    },
  };

  get availableActions(): string[] {
    const subStatus = this.status === "IN_DUNGEON" ? this.dungeon_status : this.peacezone_status;
    //@ts-expect-error idk
    return (this.actionLookup[this.status][subStatus] || this.actionLookup[this.status].default || []) as string[];
  }

  get availableScenes(): string[] {
    if (this.status === "IN_VILLAGE") {
      return Object.values(VillageScenes)
    }

    if (this.status === "IN_DUNGEON") {
      return Object.values(DungeonScenes)
    }

    return [];
  }
}
