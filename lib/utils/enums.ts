export enum GameCommands {
  MOVE = "move",
  LOOK = "look",
  ATTACK = "attack",
  RUN = "run",
  BACK = "back"
}

export enum GameplayEvents {
  // character events
  CHARACTER_CREATED = "character_created",
  CHARACTER_TIRED = "character_tired",
  CHARACTER_DEAD = "character_dead",
  CHARACTER_ATTRIBUTES_CHANGED = "character_attributes_changed",
  CHARACTER_MOVED = "character_moved",
  CHARACTER_MAX_HEALTH_REACHED = "character_max_health_reached",
  CHARACTER_MAX_ENDURANCE_REACHED = "character_max_endurance_reached",
  // locations events
  LOCATION_CHANGED = "location_changed",
  // commands events
  MOVE_STARTED = "move_started",
  LOOK_STARTED = "look_started",
  ATTACK_STARTED = "attack_started",
  RUN_STARTED = "run_started",
  BACK_STARTED = "back_started",
  MOVE_COMPLETED = "move_completed",
  LOOK_COMPLETED = "look_completed",
  ATTACK_COMPLETED = "attack_completed",
  RUN_COMPLETED = "attack_completed",
  BACK_COMPLETED = "attack_completed",
}
