import Character from "@/lib/game/Character";
import StreamEvent from "@/lib/streams/StreamEvent";
import {CharacterEvents} from "@/lib/utils/GameEvents";
import GameMap from "@/lib/game/GameMap";
import {ShopItem} from "@/lib/game/Shop";
import {InventoryItemData} from "@/lib/game/InventoryItems";
import {SceneCommands} from "@/lib/utils/GameCommands";
import BaseService from "@/lib/services/BaseService";

export default class CharacterService extends BaseService {

  public static async consume(data: StreamEvent) {
    const character = await Character.initialize(data.userId)
    const instance = new CharacterService(character)
    await instance.handleEvent(data)
  }

  constructor(model: Character) { super(model) }

  private eventHandlers = {
    [CharacterEvents.CHARACTER_MOVE_STARTED]: this.updateLocationAndMove.bind(this),
    [CharacterEvents.DUNGEON_STARTED]: this.startDungeon.bind(this),
    [CharacterEvents.DUNGEON_COMPLETED]: this.completeDungeon.bind(this),
    [CharacterEvents.ITEM_BOUGHT]: this.handleItemBought.bind(this),
    [CharacterEvents.ENEMIES_FOUND]: async (payload: any) => {
      await this.model.repo.update({dungeon_status: "inBattle"})
      await this.streamEvent.actionCompleted(this.model.userId, payload).send()
    },
    [CharacterEvents.CHARACTER_ATTACK_STARTED]: async (payload: any) => {
      await this.model.repo.update({dungeon_status: "idle"})
      // check character damage to enemy
      await this.streamEvent.attackCompleted(this.model.userId, {damage: 10}).send()
      await this.streamEvent.actionCompleted(this.model.userId, {}).send()
    },
    [CharacterEvents.REST_STARTED]: async (payload: any) => {
      await this.model.repo.update({endurance: 100, dungeon_status: "idle"})
      await this.streamEvent.actionCompleted(this.model.userId, {}).send()
    }
  }

  private async completeDungeon() {
    await this.model.repo.update({currentLocationId: 0, status: "inVillage", balance: this.model.balance + 1000})
    await this.streamEvent.actionCompleted(this.model.userId, {scene: SceneCommands.END_DUNGEON_SCENE}).send()
  }

  private async startDungeon() {
    await this.model.repo.update({currentLocationId: 1, status: "inDungeon"})
    await this.streamEvent.actionCompleted(this.model.userId, {}).send()
  }

  private async updateLocationAndMove() {
    if (this.model.endurance <= 0) {
      await this.model.repo.update({dungeon_status: "tired"})
      await this.streamEvent.characterTired(this.model.userId, {}).send()
      await this.streamEvent.actionCompleted(this.model.userId, {}).send()
      return
    }

    const map = await new GameMap().load()
    let nextLocationId = this.model.currentLocationId + 1

    if (nextLocationId > map.locations.length) {
      return await this.streamEvent.dungeonStopped(this.model.userId, {}).send()
    }

    this.model.endurance -= 5
    if (this.model.endurance <= 0) {
      await this.model.repo.update({dungeon_status: "tired"})
      await this.streamEvent.characterTired(this.model.userId, {}).send()
    }

    await this.model.repo.update({currentLocationId: nextLocationId, endurance: this.model.endurance})
    await this.streamEvent.characterMoved(this.model.userId, {}).send()
  }

  private async sendActionCompletedEvent(scene: string) {
    await this.streamEvent.actionCompleted(this.model.userId, {scene: scene}).send()
  }

  private async handleItemBought(payload: any) {
    const shopItem: ShopItem = payload.item
    const newBalance = this.model.balance - shopItem.price
    if (newBalance < 0) {
      return await this.sendActionCompletedEvent(SceneCommands.SHOP_SCENE)
    }

    await this.updateBalanceAndNotify(newBalance, shopItem)
  }

  private async updateBalanceAndNotify(newBalance: number, shopItem: ShopItem) {
    await this.model.repo.update({balance: newBalance})
    const newPayload: InventoryItemData = { item: shopItem.item, count: 1 }
    await this.streamEvent.itemAdded(this.model.userId, newPayload).send()
    await this.sendActionCompletedEvent(SceneCommands.SHOP_SCENE)
  }
}
