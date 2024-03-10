import React from 'react';
import Game from '../Game/Game';
import './App.css';
import {WebSocketProvider} from "../WebSocketContext";

const App = () => {
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
