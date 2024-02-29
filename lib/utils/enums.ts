export enum GameCommands {
  MOVE = "move",
  LOOK = "look",
  ATTACK = "attack",
  RUN = "run",
  REST = "rest"
}

export enum CharacterEvents {
  MOVE_STARTED = "move_started",
  ATTACK_STARTED = "attack_started",
  ENEMIES_FOUND = "enemies_found",
  CHARACTER_ATTRIBUTES_CHANGED = "character_attributes_changed",
  GLOBAL_CHARACTER_ATTRIBUTES_CHANGED = "global_character_attributes_changed",
  MOVE_COMPLETED = "move_completed",
  REST_STARTED = "rest_started",
  ACTION_COMPLETED = "action_completed",
  RANDOM_EVENT_FOUND = "random_event_found",
}
export type CharacterEvent = typeof CharacterEvents

export enum GeneratorEvents {
  CHARACTER_MOVED = "character_moved",
  LOOK_STARTED = "look_started",
}
export type GeneratorEvent = typeof GeneratorEvents

export enum LoggerEvents {
  MOVE_STARTED = "move_started",
  CHARACTER_TIRED = "character_tired",
  ITEMS_FOUND = "items_found",
  RANDOM_EVENT_FOUND = "random_event_found",
  CHARACTER_ATTRIBUTES_CHANGED = "character_attributes_changed",
  ATTACK_COMPLETED = "attack_completed",
  ENEMIES_FOUND = "enemies_found",
  REST_COMPLETED = "rest_completed",
  NOTHING_FOUND = "nothing_found",
  CHARACTER_DEAD = "character_dead",
}
export type LoggerEvent = typeof LoggerEvents

export enum RendererEvents {
  GAME_INIT = "game_init",
  ACTION_COMPLETED = "action_completed"
}
export type RendererEvent = typeof RendererEvents

export enum OtherEvents {
  GAME_QUITED = "game_quited",
  CHARACTER_CREATED = "character_created",
  CHARACTER_MAX_HEALTH_REACHED = "character_max_health_reached",
  CHARACTER_MAX_ENDURANCE_REACHED = "character_max_endurance_reached",
  RUN_STARTED = "run_started",
  LOOK_COMPLETED = "look_completed"
}

export const GameplayEvents = {
  ...OtherEvents,
  ...CharacterEvents,
  ...GeneratorEvents,
  ...LoggerEvents,
  ...RendererEvents
}
