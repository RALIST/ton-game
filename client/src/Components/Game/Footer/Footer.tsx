import React from 'react';

import style from './Footer.module.css';
import {GameplayData} from "../../../types/gameplay";
import {gameCommandLabels} from "../../../enums/GameCommands";
const Footer = ({game}: {game: GameplayData}) => {
  return (
    <footer className={style.footer}>
      <div className={style.footer}>
        {game.availableActions.map((action, index) => {
          // @ts-ignore
          return <div key={index}>{gameCommandLabels[action]}</div>
        } )}
      </div>
    </footer>
  );
};

export default Footer;
