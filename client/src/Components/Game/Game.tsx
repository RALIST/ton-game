import React, {useEffect, useState} from 'react';
import Energy from './Energy/Energy';
import style from './Game.module.css';
import {useWebSocket} from "../WebSocketContext";

type GameplayData = {
  character: {
    currentHealth: number,
    maxHealth: number,
    endurance: number,
    maxEndurance: number,
    balance: number
  },
  availableActions: string[],
  currentScene: string
}

const Game = () => {
  const ws = useWebSocket()
  const [game, setGame] = useState<GameplayData | null>(null)
  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        ws.send('{}'); // ping server
      }

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data)
        setGame(data)
      }

      ws.onclose = () => {
        // close mini app
      }
    }
  });

  if (!game) return <div>Loading...</div>

  return (
    <div className={style.game}>
      <header className={style.header}>
        <Energy icon={'❤️'} color={'red'} value={game.character.currentHealth} max={game.character.maxHealth} />
        <Energy icon={'⚡️'} color={'darkorange'} value={game.character.endurance} max={game.character.maxEndurance} />
        {/*<Money value={game.character.balance} />*/}
      </header>
      <main className={style.main}>
        {game.availableActions.map((action, index) => {
          return <div key={index}>{action}</div>
        } )}
      </main>
      <footer className={style.footer}>
      </footer>
    </div>
  );
};

export default Game;
