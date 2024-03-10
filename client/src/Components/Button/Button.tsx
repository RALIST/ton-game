import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  name: string;
  onButtonClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ name, onButtonClick }) => {
  return (
    <button onClick={onButtonClick} className={styles.btn}>
      {name}
    </button>
  );
};

export default Button;
