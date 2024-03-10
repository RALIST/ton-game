import React from 'react';
import style from './MainMenu.module.css';
import Button from '../Button/Button';

interface MainMenuProps {
  onButtonClick: () => void;
  showContinueButton: boolean;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onButtonClick,
  showContinueButton,
}) => {
  const handleContinueClick = () => {
    onButtonClick();
  };

  return (
    <div className={style.menu}>
      <div className={style.button}>
        <Button onButtonClick={onButtonClick} name={'Новая игра'} />
      </div>
      {showContinueButton && (
        <div className={style.button}>
          <Button onButtonClick={handleContinueClick} name={'Продолжить'} />
        </div>
      )}
      <div className={style.button}>
        <Button onButtonClick={() => {}} name={'Настройки'} />
      </div>
      <div className={style.button}>
        <Button onButtonClick={() => {}} name={'Выход'} />
      </div>
    </div>
  );
};

export default MainMenu;
