import React from 'react';
import style from './Maps.module.css';
import Map from '../icons/map.png';

const Maps: React.FC = () => {
  return (
    <div className={style.item}>
      <img className={style.img} src={Map} alt='item' />
      <p className={style.name}>Заброшенная станция</p>
    </div>
  );
};

export default Maps;
