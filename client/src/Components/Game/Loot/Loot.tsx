import React from 'react';
import style from './Loot.module.css';
import Knife from '../icons/knife.png';

const Loot: React.FC = () => {
  return (
    <div className={style.item}>
      <img className={style.img} src={Knife} alt='item' />
      <p className={style.name}>Name</p>
    </div>
  );
};

export default Loot;
