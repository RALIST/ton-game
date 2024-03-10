import React from 'react';
import style from './Money.module.css';

interface MoneyProps {
  value: number;
}

const Money: React.FC<MoneyProps> = ({ value }) => {
  const money: number = value;

  return (
    <div className={style.money}>
      <div className={style.icon} data-value={money}>
        💶
      </div>
      <p className={style.money}>{money}</p>
    </div>
  );
};

export default Money;
