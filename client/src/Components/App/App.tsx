import Game from '../Game/Game';
import './App.css';
import {WebSocketProvider} from "../WebSocketContext";
import {InitData} from "@tma.js/sdk";

export const initData = new InitData({
  authDate: new Date(),
  canSendAfter: 1000,
  chat: {
    id: 7728558344,
    photoUrl: 'https://img.static.telegram.org/image',
    type: 'group',
    title: 'Telegram Developers',
    username: 'johnybravo',
  },
  chatType: 'sender',
  chatInstance: '-9982961682389',
  hash: 'myhash',
  queryId: 'AAHdF6IQAAAAAN0Xoh',
  startParam: 'customvalue',
  user: {
    addedToAttachmentMenu: false,
    allowsWriteToPm: true,
    firstName: 'Johny',
    id: 22231781,
    isBot: false,
    isPremium: true,
    lastName: 'Bravo',
    languageCode: 'en',
    photoUrl: 'https://img.static.telegram.org/johnybravo',
    username: 'johnybravo',
  },
});

const App = () => {
  // const hostname = window.location.hostname
  let wsUrl: string;

  // if (hostname === "localhost") {
  //   wsUrl = `ws://localhost:80/socket?userId=${initData.user?.id}`
  // } else {
  //   wsUrl = `wss://${hostname}/socket?userId=${initData.user?.id}`;
  // }

  wsUrl = `ws://localhost:3030/socket?userId=${initData.user?.id}`

  return (
    // TMA provider for telegram mini apps
    // <TmaSDKLoader>
      <WebSocketProvider url={wsUrl}>
        <Game/>
      </WebSocketProvider>
    // </TmaSDKLoader>

  );
};

export default App;
