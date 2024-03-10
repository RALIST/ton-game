import React, { useState } from 'react';
import styles from './Pause.module.css';
import Pause1 from '../img/pause1.png';
import Pause2 from '../img/pause2.png';

interface PauseProps {
  pauseClick: () => void;
}

const Pause: React.FC<PauseProps> = ({ pauseClick }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsClicked(true);
    pauseClick();
    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  };

  return (
    <div
      className={styles.btn}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isClicked ? (
        <img className={styles.pause} src={Pause2} alt='Изображение 2' />
      ) : isHovered ? (
        <img className={styles.pause} src={Pause2} alt='Изображение 2' />
      ) : (
        <img className={styles.pause} src={Pause1} alt='Изображение 1' />
      )}
    </div>
  );
};

export default Pause;
