import React, { useState } from 'react';
import Game from '../Game/Game';
import './App.css';
import {WebSocketProvider} from "../WebSocketContext";

const App: React.FC = () => {
  const [showMainMenu, setShowMainMenu] = useState<boolean>(true);
  const [showContinueButton, setShowContinueButton] = useState<boolean>(false);

  const handleButtonClick = () => {
    setShowMainMenu(false);
    setShowContinueButton(true);
  };

  const handleReturnToMainMenu = () => {
    setShowMainMenu(true);
  };

  const hostname = window.location.hostname
  let wsUrl: string;

  if (hostname === "localhost") {
    wsUrl = `ws://localhost:80/socket?userId=1`
  } else {
    wsUrl = `wss://${hostname}/socket?userId=1`;
  }

  return (
    // <TmaSDKLoader>
      <WebSocketProvider url={wsUrl}>
        <div className='app'>
          <Game/>
        </div>
      </WebSocketProvider>
    // </TmaSDKLoader>

  );
};

export default App;
