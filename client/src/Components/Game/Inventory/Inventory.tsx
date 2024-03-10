import React from 'react';
import Loot from '../Loot/Loot';
import Maps from '../Maps/Maps';
import FooterBtn from '../../Button/FooterBtn/FooterBtn';
import style from './Inventory.module.css';
import Close1 from '../icons/close1.png';
import Close2 from '../icons/close2.png';
import Close3 from '../icons/close3.png';

interface InventoryProps {
  selectedItem: { names: string } | null;
  onClose: () => void;
  onMapClick: () => void;
  onBackpackClick: () => void;
}

const Inventory: React.FC<InventoryProps> = ({
  selectedItem,
  onClose,
  onMapClick,
  onBackpackClick,
}) => {
  return (
    <div className={style.inventory}>
      <div className={style.btn}>
        <FooterBtn
          image1={Close1}
          image2={Close3}
          image3={Close2}
          width='25px'
          onClick={onClose}
        />
      </div>
      {selectedItem && <p className={style.title}>{selectedItem.names}</p>}
      <div className={style.loot}>
        {selectedItem && selectedItem.names === 'Карта' && (
          <>
            <Maps /> <Maps /> <Maps /> <Maps /> <Maps />
          </>
        )}
        {selectedItem && selectedItem.names === 'Рюкзак' && (
          <>
            <Loot />
            <Loot />
            <Loot />
            <Loot />
            <Loot />
          </>
        )}
      </div>
    </div>
  );
};

export default Inventory;
