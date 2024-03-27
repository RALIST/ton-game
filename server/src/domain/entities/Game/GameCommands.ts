export enum MainScenes {
  VILLAGE_SCENE = "village_scene",
  ROUTE_SCENE = "route_scene",
}

export enum DungeonScenes {
  END_ROUTE_SCENE = "end_route_scene"
}

export enum VillageScenes {
  BAR_SCENE = "bar_scene",
  SHOP_SCENE = "shop_scene",
  WAREHOUSE_SCENE = "warehouse_scene",
  HOME_SCENE = "home_scene",
  BANK_SCENE = "bank_scene",
  PLAYER_SCENE = "player_scene",
  INVENTORY_SCENE = "inventory_scene",
  ROUTES_SCENE = "routes_scene"
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
