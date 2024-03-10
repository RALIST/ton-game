import React, { useState } from 'react';
import style from './FooterBtn.module.css';

interface FooterBtnProps {
  image1: string;
  image2: string;
  image3: string;
  width: string;
  onClick?: () => void;
}

const FooterBtn: React.FC<FooterBtnProps> = ({
  image1,
  image2,
  image3,
  width,
  onClick,
}) => {
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
    if (onClick) {
      onClick();
    }

    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  };

  return (
    <div
      className={style.btn}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isClicked ? (
        <img
          className={style.footer}
          src={image2}
          alt='Изображение 2'
          style={{ width: `${width}`, height: `${width}` }}
        />
      ) : isHovered ? (
        <img
          className={style.footer}
          src={image3}
          alt='Изображение 3'
          style={{ width: `${width}`, height: `${width}` }}
        />
      ) : (
        <img
          className={style.footer}
          src={image1}
          alt='Изображение 1'
          style={{ width: `${width}`, height: `${width}` }}
        />
      )}
    </div>
  );
};

export default FooterBtn;
