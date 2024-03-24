export enum MainScenes {
  VILLAGE_SCENE = "village_scene",
  DUNGEON_SCENE = "dungeon_scene",
}

export enum DungeonScenes {
  END_DUNGEON_SCENE = "end_dungeon_scene"
}

export enum VillageScenes {
  BAR_SCENE = "bar_scene",
  SHOP_SCENE = "shop_scene",
  WAREHOUSE_SCENE = "warehouse_scene",
  HOME_SCENE = "home_scene",
  BANK_SCENE = "bank_scene",
  START_DUNGEON_SCENE = "start_dungeon_scene",
  CHARACTER_SCENE = "character_scene",
  PLAYER_SCENE = "player_scene",
  INVENTORY_SCENE = "inventory_scene",
}

export enum ActionCommands {
  MOVE = "move",
  LOOK = "look",
  ATTACK = "attack",
  DEFENCE = "defence",
  RUN = "run",
  REST = "rest",
  USE_ITEM = "use_item",
  EQUIP_ITEM = "equip_item",
  TAKE_ITEM = "take_item",
  TALK = "talk",
  TRADE = "trade",
  LEARN = "learn",
  CRAFT_ITEM = "craft_item",
  CRAFT_MEDICINE ="craft_medicine",
  ACCEPT_QUEST = "accept_quest",
  COMPLETE_QUEST = "complete_quest",
  START_ROUTE = "start_route",
  STOP_ROUTE = "stop_route",
  BUY_ITEM = "buy_item",
  UNEQUIP_ITEM = "unequip_item",
  CHANGE_SCENE = "change_scene"
}

export const GameCommands = {
  ...MainScenes,
  ...VillageScenes,
  ...DungeonScenes,
  ...ActionCommands
}

export const gameCommandLabels = {
  [GameCommands.MOVE]: "Идти дальше",
  [GameCommands.LOOK]: "Осмотреться",
  [GameCommands.REST]: "Разбить лагерь",
  [GameCommands.ATTACK]: "Атака",
  [GameCommands.RUN]: "Убежать",
  [GameCommands.DEFENCE]: "Защита",
  [GameCommands.BAR_SCENE]: "Бар",
  [GameCommands.SHOP_SCENE]: "Магазин",
  [GameCommands.HOME_SCENE]: "Дом",
  [GameCommands.WAREHOUSE_SCENE]: "Хранилище",
  [GameCommands.START_DUNGEON_SCENE]: "Вылазка",
  [GameCommands.BANK_SCENE]: "Банк",
  [GameCommands.STOP_ROUTE]: "Закончить вылазку"
};
