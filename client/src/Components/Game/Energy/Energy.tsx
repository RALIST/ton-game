import React from 'react';
import style from './Energy.module.css';

interface EnergyProps {
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
}

const Energy: React.FC<EnergyProps> = ({ value, max, color, icon }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={style.energy}>
      <div className={style.energy_icon}>{icon}</div>
      <div
        style={{
          margin: 'auto 0',
          border: '1px solid black',
          width: '100px',
          borderRadius: '15px',
          height: '10px',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '10px',
            backgroundColor: color,
            borderRadius: '15px',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Energy;
