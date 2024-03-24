import {gameActionLabels} from "@/shared/enums/GameCommands.ts";
import style from '@/widgets/styles/Footer.module.css';

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
