export enum GameCommands {
  MOVE = "move",
  LOOK = "look",
  ATTACK = "attack",
  RUN = "run",
  BACK = "back"
}

export enum CharacterEvents {
  CREATED = "character_created",
  TIRED = "character_tired",
  DEAD = "character_dead",
  HEALTH_CHANGED = "character_health_changed",
  ENDURANCE_CHANGED = "character_endurance_changed"
}

export enum MapEvents {
  LOCATION_CHANGED = "location_changed"
}

export enum GameplayEvent {
  MOVE_STARTED = "move_started",
  LOOK_STARTED = "look_started",
  ATTACK_STARTED = "attack_started",
  RUN_STARTED = "run_started",
  BACK_STARTED = "back_started",
  MOVE_COMPLETED = "move_completed"
}
