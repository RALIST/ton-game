import CharacterConsumer from "@/lib/Character/CharacterConsumer";
import InventoryConsumer from "@/lib/Inventory/InventoryConsumer";
import LoggerConsumer from "@/lib/Logger/LoggerConsumer";
import RendererConsumer from "@/lib/Renderer/RendererConsumer";
import GameplayConsumer from "@/lib/Gameplay/GameplayConsumer";

CharacterConsumer.start()
InventoryConsumer.start()
LoggerConsumer.start()
RendererConsumer.start()
GameplayConsumer.start()
