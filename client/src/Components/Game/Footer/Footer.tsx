import React from 'react';
import FooterBtn from '../../Button/FooterBtn/FooterBtn';

import style from './Footer.module.css';

interface FooterProps {
  items: { image1: string; image2: string; image3: string; id: number }[];
  onInventoryClick: (id: number) => void;
  image1: string;
  image2: string;
  image3: string;
}

const Footer: React.FC<FooterProps> = ({ items, onInventoryClick }) => {
  return (
    <div className={style.footer}>
      {items.map((item, index) => (
        <FooterBtn
          key={index}
          image1={item.image1}
          image2={item.image2}
          image3={item.image3}
          width='60px'
          onClick={() => onInventoryClick(item.id)}
        />
      ))}
    </div>
  );
};

export default Footer;
