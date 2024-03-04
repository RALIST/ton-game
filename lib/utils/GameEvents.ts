export enum CharacterEvents {
  CHARACTER_MOVE_STARTED = "character_move_started",
  CHARACTER_ATTACK_STARTED = "character_attack_started",
  ENEMIES_FOUND = "enemies_found",
  CHARACTER_ATTRIBUTES_CHANGED = "character_attributes_changed",
  GLOBAL_CHARACTER_ATTRIBUTES_CHANGED = "global_character_attributes_changed",
  CHARACTER_MOVE_COMPLETED = "move_completed",
  REST_STARTED = "rest_started",
  CHARACTER_ACTION_COMPLETED = "character_action_completed",
  RANDOM_EVENT_FOUND = "random_event_found",
  CHARACTER_RUN_STARTED = "character_run_started",
}

export enum GameplayEvents {
  CHARACTER_MOVED = "character_moved",
  LOOK_STARTED = "look_started",
}

export enum LoggerEvents {
  CHARACTER_MOVE_STARTED = "character_move_started",
  CHARACTER_TIRED = "character_tired",
  ITEMS_FOUND = "items_found",
  RANDOM_EVENT_FOUND = "random_event_found",
  CHARACTER_ATTRIBUTES_CHANGED = "character_attributes_changed",
  CHARACTER_ATTACK_COMPLETED = "attack_completed",
  ENEMIES_FOUND = "enemies_found",
  REST_COMPLETED = "rest_completed",
  NOTHING_FOUND = "nothing_found",
  CHARACTER_DEAD = "character_dead",
  CHARACTER_RUN_COMPLETED = "run_completed",
  DANGER_EVENT_FOUND = "danger_event_found"
}

export enum RendererEvents {
  GAME_INIT = "game_init",
  CHARACTER_ACTION_COMPLETED = "character_action_completed",
  CHANGE_SCREEN_STARTED = "change_screen_started"
}

export enum OtherEvents {
  GAME_QUITED = "game_quited",
  CHARACTER_CREATED = "character_created",
  CHARACTER_MAX_HEALTH_REACHED = "character_max_health_reached",
  CHARACTER_MAX_ENDURANCE_REACHED = "character_max_endurance_reached",
  LOOK_COMPLETED = "look_completed",
}

export enum InventoryEvents {
  ITEM_ADDED = "item_added"
}

export const GameEvents = {
  ...OtherEvents,
  ...CharacterEvents,
  ...GameplayEvents,
  ...LoggerEvents,
  ...RendererEvents,
  ...InventoryEvents
}
