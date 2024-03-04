import {CharacterEvents} from "@/lib/utils/GameEvents";
import {RedisStorage, WithRedisStorage} from "@/lib/storages/RedisStorage";
import {applyOperation} from "@/lib/utils/helpers";
import {GameMap} from "@/lib/game/GameMap";
import StreamEvent from "@/lib/streams/StreamEvent";
import Skill from "@/lib/game/character/Skill";

import characterData from "../data/character.json"
import skillsData from "../data/skills.json"
import perksData  from "../data/perks.json"
import {GameCommands} from "@/lib/utils/GameCommands";

export type CharacterSkill = {
  skillId: number,
  level: number,
  exp: number
}

export type CharacterAttribute = {
  name: string,
  description: string,
  value: number
}

export class Character implements WithRedisStorage {
  userId: number;
  name!: string;
  maxHealth!: number;
  currentHealth!: number;
  endurance!: number;
  balance!: number;
  maxEndurance!: number
  enduranceRecoverySpeed!: number
  healthRecoverySpeed!: number;
  currentLocationId!: number
  status!: "idle" | "inBattle" | "inAction" | "tired" | "looked" | "dead"
  storage!: RedisStorage
  skills!: CharacterSkill[] // skills ids
  perks!: number[] // perks ids
  attributes!: CharacterAttribute[]

  constructor(id: number) {
    this.userId = id
    this.enduranceRecoverySpeed = 0.01// minutes to recover 1 endurance
    this.healthRecoverySpeed = 0.01 // minutes to recovery health
    this.storage = new RedisStorage(`character:${this.userId}`)
    this.maxEndurance = 100
  }

  // find character in DB and return initiated class
  async load(): Promise<this> {
    const data = await this.storage.load()
    this.currentHealth = data?.currentHealth ?? characterData.health[0]
    this.endurance = data?.endurance ?? characterData.endurance
    this.maxHealth = data?.maxHealth ?? characterData.health[1]
    this.balance = data?.balance ?? characterData.balance
    this.name = data?.name ?? characterData.name
    this.currentLocationId = data?.currentLocationId ?? 1
    this.status = data?.status ?? "idle"
    this.skills = data?.skills ?? await this.loadSkills()
    this.perks = data?.perks ?? await this.loadPerks()
    this.attributes = data?.attributes ?? await this.loadAttributes()

    if (!data) {
      await this.dump()
    }

    return this
  }

  async loadSkills() {
    const skls: CharacterSkill[] = []
    skillsData.map(skill => {
      skls.push({
        skillId: skill.id,
        level: 1,
        exp: 0
      })
    })

    this.skills = skls
    await this.update({skills: skls})
  }

  async getSkills() {
    if (!this.skills) {
      await this.loadSkills()
    }

    return this.skills.map(skill => {
      const s: Skill | undefined = skillsData.find(dataSkill => dataSkill.id == skill.skillId)
      return { skill: s, level: skill.level, exp: skill.exp }
    })
  }

  async loadPerks() {
    const prks: number[] =  []
    const randomPerk = perksData[(Math.floor(Math.random() * perksData.length))]
    prks.push(randomPerk.id)
    this.perks = prks

    await this.update({perks: prks})
  }

  async getPerks() {
    if (!this.perks) {
      await this.loadPerks()
    }

    return perksData.filter(perk => this.perks.includes(perk.id))
  }

  async loadAttributes(){
    const attrs: CharacterAttribute[] = []
    const attr1: CharacterAttribute = {name: "Сила", description: "" , value: 1}
    const attr2: CharacterAttribute = {name: "Восприятие", description: "" , value: 1}
    const attr3: CharacterAttribute = {name: "Выносливость", description: "" , value: 1}
    const attr4: CharacterAttribute = {name: "Харизма", description: "" , value: 1}
    const attr5: CharacterAttribute = {name: "Интеллект", description: "" , value: 1}
    const attr6: CharacterAttribute = {name: "Ловкость", description: "" , value: 1}
    const attr7: CharacterAttribute = {name: "Удача", description: "" , value: 1}

    attrs.push(attr1, attr2, attr3, attr4, attr5, attr6, attr7)
    this.attributes = attrs

    await this.update({attributes: attrs})
  }

  async getAttributes() {
    if (!this.attributes) {
      await this.loadAttributes()
    }

    return this.attributes
  }

  async dump() {
    await this.storage.dump(this.toJson())
  }

  async update(data: any) {
    await this.storage.update(data)
  }

  async handleEvent(event: string, payload: any) {
    switch (event) {
      case CharacterEvents.CHARACTER_MOVE_STARTED: {
        await this.handleMoveStarted(payload)
        break;
      }
      case CharacterEvents.CHARACTER_ATTACK_STARTED: {
        await this.handleAttackStarted(payload)
        break;
      }
      case CharacterEvents.CHARACTER_RUN_STARTED: {
        await this.handleRunStarted(payload)
        break;
      }
      case CharacterEvents.ENEMIES_FOUND: {
        await this.handleEnemiesFound(payload)
        break;
      }
      case CharacterEvents.RANDOM_EVENT_FOUND: {
        await new StreamEvent().actionCompleted(this.userId, {status: "idle"}).send()
        break;
      }
      case CharacterEvents.CHARACTER_ATTRIBUTES_CHANGED: {
        await this.handleAttributesChange(payload)
        break;
      }
      case CharacterEvents.REST_STARTED: {
        await this.update({currentHealth: this.maxHealth, endurance: this.maxEndurance})
        await new StreamEvent().restCompleted(this.userId, payload).send()
        await new StreamEvent().actionCompleted(this.userId, payload).send()
        break;
      }
      case CharacterEvents.CHARACTER_ACTION_COMPLETED: {
        await this.handleActionCompleted(payload)
        break;
      }
      default: { return }
    }
  }

  async handleMoveStarted(payload: any) {
    const streamEvent = new StreamEvent()
    if (this.endurance > 0) {
      const newPayload = { ...payload, endurance: { type: "subtract", value: 1 } }
      await streamEvent.characterAttributesChanged(this.userId, newPayload).send()
      await this.changeLocation()
      await streamEvent.characterMoved(this.userId, payload).send()
    } else {
      await streamEvent.characterTired(this.userId, payload).send()
      await streamEvent.actionCompleted(this.userId, {status: "tired"}).send()
    }
  }
  async handleRunStarted(payload: any) {
    const streamEvent = new StreamEvent()

    if (this.endurance > 0) {
      const newPayload = { ...payload, health: {type: "subtract", value: 1 } }
      await streamEvent.characterAttributesChanged(this.userId, newPayload).send()
      await this.changeLocation()
      await streamEvent.runCompleted(this.userId, {location: (await this.currentLocation()).name}).send()
      await streamEvent.characterMoved(this.userId, payload).send()
    } else {
      await streamEvent.characterTired(this.userId, payload).send()
      await streamEvent.actionCompleted(this.userId, {status: "tired"}).send()
    }
  }

  getAvailableAction(): string[] {
    switch(this.status) {
      case "idle": {
        return [GameCommands.MOVE, GameCommands.LOOK]
      }
      case "inBattle": {
        return [GameCommands.ATTACK, GameCommands.DEFENCE, GameCommands.USE_ITEM, GameCommands.RUN]
      }
      case "tired": {
        return [GameCommands.REST]
      }
      case "dead": {
        return [GameCommands.REST]
      }
      case "looked": {
        return [GameCommands.MOVE]
      }
      default: {
        return []
      }
    }
  }

  async changeLocation() {
    const map = await new GameMap().load()

    let nextLocationId = (this.currentLocationId + 1) % (map.locations.length + 1)
    if (nextLocationId == 0) nextLocationId = 1
    this.currentLocationId = nextLocationId
    await this.update({currentLocationId: nextLocationId})
  }

  async currentLocation() {
    const map = await new GameMap().load()
    const location =  map.locations.find((location) => location.id === this.currentLocationId)
    return location || map.locations[0]
  }

  private async handleAttributesChange(payload: {
    health: {value: number, type: string } ,
    endurance: {value: number, type: string }
  }) {
    const streamEvent = new StreamEvent()
    const {health, endurance} = payload
    if (health) {
      const { type, value } = health
      const maxHealth = this.currentHealth === this.maxHealth && type === "add"

      if (!maxHealth) {
        const newValue = applyOperation(this.currentHealth, value, type)
        if (newValue >= this.maxHealth) {
          this.currentHealth = this.maxHealth
          await streamEvent.characterMaxHealthReached(this.userId, payload).send()
        } else if (newValue < 0) {
          this.currentHealth = 0
          await streamEvent.characterDied(this.userId, payload).send()
          await streamEvent.actionCompleted(this.userId, {status: "dead"}).send()
        } else {
          this.currentHealth = newValue
        }
      }

      await this.update({currentHealth: this.currentHealth})
    }

    if (endurance) {
      const { type, value } = endurance
      const maxEndurance = this.endurance === this.maxEndurance && type === "add"

      if (!maxEndurance) {
        const newValue = applyOperation(this.endurance, value, type)
        if (newValue >= this.maxEndurance) {
          this.endurance = this.maxEndurance
          await streamEvent.characterMaxEnduranceReached(this.userId, payload).send()
        } else if (newValue < 0) {
          this.endurance = 0
        } else {
          this.endurance = newValue
        }
      }

      await this.update({endurance: this.endurance})
    }
  }

  toJson() {
    const {
      storage:_,
      ...props} = this

    return props
  }

  private async handleEnemiesFound(_payload: any) {
    await new StreamEvent().actionCompleted(this.userId, {status: "inBattle"}).send()
  }

  private async handleAttackStarted(payload: any) {
    const streamEvent = new StreamEvent()
    const newPayload = { ...payload, health: { type: "subtract", value: 1 } };
    await streamEvent.characterAttributesChanged(this.userId, newPayload).send()
    await streamEvent.attackCompleted(this.userId, payload).send()
    await streamEvent.actionCompleted(this.userId, {status: "idle"}).send()
  }

  private async handleActionCompleted(payload: any) {
    this.status = payload?.status ?? "idle"
    await this.update({status: this.status})
  }
}
