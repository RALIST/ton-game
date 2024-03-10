import React, { useState } from 'react';
import Energy from './Energy/Energy';
import style from './Game.module.css';
import Money from './Money/Money';
import Pause from '../Button/Pause/Pause';
import Footer from './Footer/Footer';
import Inventory from './Inventory/Inventory';
import Charicon1 from './icons/charicon1.png';
import Charicon2 from './icons/charicon2.png';
import Charicon3 from './icons/charicon3.png';
import Map1 from './icons/map1.png';
import Map2 from './icons/map2.png';
import Map3 from './icons/map3.png';
import Backpack1 from './icons/backpack1.png';
import Backpack3 from './icons/backpack2.png';
import Backpack2 from './icons/backpack3.png';
import Directory1 from './icons/directory1.png';
import Directory3 from './icons/directory2.png';
import Directory2 from './icons/directory3.png';

interface GameProps {
  pauseClick: () => void;
}

const Game: React.FC<GameProps> = ({ pauseClick }) => {
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<{ names: string } | null>(
    null
  );
  const handleToggleInventory = () => {
    setShowInventory(!showInventory);
  };

  const handleInventoryClick = (id: number) => {
    const selectedItem = items.find((item) => item.id === id);
    selectedItem && setSelectedItem(selectedItem);
    setShowInventory(true);
  };
  const handleItemClick = (itemName: string) => {
    setSelectedItem({ names: itemName });
  };
  const items = [
    {
      id: 1,
      names: 'Персонаж',
      image1: Charicon1,
      image2: Charicon2,
      image3: Charicon3,
    },
    { id: 2, names: 'Карта', image1: Map1, image2: Map2, image3: Map3 },
    {
      id: 3,
      names: 'Рюкзак',
      image1: Backpack1,
      image2: Backpack2,
      image3: Backpack3,
    },
    {
      id: 4,
      names: 'Книга',
      image1: Directory1,
      image2: Directory2,
      image3: Directory3,
    },
  ];
  return (
    <div className={style.game}>
      <header className={style.header}>
        <div className={style.wrap}>
          <Energy icon={'❤️'} color={'red'} value={70} max={100} />
          <Energy icon={'⚡️'} color={'orange'} value={70} max={100} />
        </div>
        <Money value={0} />
        <Pause pauseClick={pauseClick} />
      </header>
      <main className={style.main}>
        {showInventory && (
          <Inventory
            selectedItem={selectedItem}
            onClose={handleToggleInventory}
            onMapClick={() => handleItemClick('Карта')}
            onBackpackClick={() => handleItemClick('Рюкзак')}
          />
        )}
      </main>
      <footer className={style.footer}>
        <Footer
          items={items}
          onInventoryClick={handleInventoryClick}
          image1='path/to/image1.png'
          image2='path/to/image2.png'
          image3='path/to/image3.png'
        />
      </footer>
    </div>
  );
};

export default Game;
