import {InitData} from "@tma.js/sdk";
// mock for init data, do not use in production

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
