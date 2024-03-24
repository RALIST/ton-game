
import Inventory from "../Inventory/Inventory";

export default function InventoryScene({game}: { game: any}) {
  return (
    <main>
      <Inventory inventory={game.inventory}/>
    </main>
  );
}
