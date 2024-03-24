
import Inventory from "@/widgets/ui/Inventory";

export default function InventoryPage({game}: { game: any}) {
  return (
    <main>
      <Inventory inventory={game.inventory}/>
    </main>
  );
}
