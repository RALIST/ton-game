import React from 'react';
import style from './Inventory.module.css';
import {GameplayData} from "../../../types/gameplay";

const Inventory = ({inventory}: {inventory: GameplayData["inventory"]}) => {
  return (
    <div className={style.inventory}>
      {inventory.items.map((item, index) => {
        return <div key={index}>{item.item.name}</div>
      })}
    </div>
  );
};

export default Inventory;
