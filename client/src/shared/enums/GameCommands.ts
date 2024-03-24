export enum SceneCommands {
  BAR_SCENE = "bar_scene",
  SHOP_SCENE = "shop_scene",
  WAREHOUSE_SCENE = "warehouse_scene",
  HOME_SCENE = "home_scene",
  BANK_SCENE = "bank_scene",
  START_ROUTE_SCENE = "start_dungeon_scene",
  END_ROUTE_SCENE = "end_dungeon_scene",
  VILLAGE_SCENE = "village_scene",
  PLAYER_SCENE = "player_scene",
  INVENTORY_SCENE = "inventory_scene",
  ROUTES_SCENE = "routes_scene"
}

export enum ActionCommands {
  MOVE = "move",
  LOOK = "look",
  ATTACK = "attack",
  RUN = "run",
  REST = "rest",
  DEFENCE = "defence",
  USE_ITEM = "use_item",
  EQUIP_ITEM = "equip_item",
  TAKE_ITEM = "take_item",
  TALK = "talk",
  TRADE = "trade",
  LEARN = "learn",
  CHANGE_SCREEN = "change_screen",
  CRAFT_ITEM = "craft_item",
  CRAFT_MEDICINE ="craft_medicine",
  ACCEPT_QUEST = "accept_quest",
  COMPLETE_QUEST = "complete_quest",
  START_DUNGEON = "start_dungeon",
  STOP_DUNGEON = "stop_dungeon",
  BUY_ITEM = "buy_item",
  UNEQUIP_ITEM = "unequip_item"
}

export const GameCommands = {
  ...SceneCommands,
  ...ActionCommands
}

export const gameCommandLabels: {[key: string]: string} = {
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
  [GameCommands.START_ROUTE_SCENE]: "Вылазка",
  [GameCommands.BANK_SCENE]: "Банк",
  [GameCommands.STOP_DUNGEON]: "Закончить вылазку",
  [GameCommands.INVENTORY_SCENE]: "Инвентарь",
  [GameCommands.PLAYER_SCENE]: "Персонаж",
  [GameCommands.ROUTES_SCENE]: "Вылазки",
};
