import React from 'react'
import ReactDOM from 'react-dom/client'
import {WebSocketProvider} from "@/app/providers/WebsocketProvider.tsx";
import Game from "@/app/ui/Game.tsx";
import {initData} from "@/shared";
import '@/app/styles/index.css'

// const hostname = window.location.hostname
let wsUrl: string;

// if (hostname === "localhost") {
//   wsUrl = `ws://localhost:80/socket?userId=${initData.user?.id}`
// } else {
//   wsUrl = `wss://${hostname}/socket?userId=${initData.user?.id}`;
// }

wsUrl = `ws://localhost:3030/socket?userId=${initData.user?.id}`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebSocketProvider url={wsUrl}>
      <Game/>
    </WebSocketProvider>
  </React.StrictMode>,
)
