import {gameActionLabels} from "@shared/enums/GameCommands.ts";
import style from './Footer.module.css';

const Footer = ({game}: { game: {availableActions: string[] } }) => {
  return (
    <footer className={style.footer}>
      {game.availableActions.map((action: string, index: number) => {
        return <div key={index}>{gameActionLabels[action]}</div>
      })}
    </footer>
  );
};

export default Footer;
