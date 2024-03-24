
import style from './Footer.module.css';
import {gameActionLabels} from "@/shared/enums/GameCommands.ts";

const Footer = ({game}: {game: any}) => {
  return (
    <footer className={style.footer}>
      {game.availableActions.map((action: string) => {
        return <div>{gameActionLabels[action]}</div>
      })}
    </footer>
  );
};

export default Footer;
