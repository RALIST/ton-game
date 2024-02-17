'use client';

import { useEffect, useMemo, useState } from 'react';
import {useBackButton, useInitData, useMainButton, useViewport} from '@tma.js/sdk-react';
import dynamic from "next/dynamic";

const GameNoSSR = dynamic(
  () => import('@/components/Game'),
  { ssr: false }
);

function MainButtonTest() {
  const mainButton = useMainButton();
  const backButton = useBackButton();
  const viewport = useViewport();

  const [count, setCount] = useState(0);

  useEffect(() => {
    const onMainButtonClick = () => setCount((prevCount) => prevCount + 1);
    const onBackButtonClick = () => setCount((prevCount) => prevCount - 1);

    viewport.expand();
    mainButton.enable().show();
    mainButton.on('click', onMainButtonClick);
    backButton.on('click', onBackButtonClick);

    return () => {
      mainButton.off('click', onMainButtonClick);
      mainButton.hide();
      backButton.off('click', onBackButtonClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mainButton.setText(`Count is ${count}`);
  }, [mainButton, count]);

  useEffect(() => {
    if (count === 0) {
      backButton.hide();
      return;
    }
    backButton.show();
  }, [backButton, count]);

  return null;
}

/**
 * Displays current application init data.
 */
function InitData() {
  const initData = useInitData();

  const initDataJson = useMemo(() => {
    if (!initData) {
      return 'Init data is empty.';
    }
    const { authDate, chat, hash, canSendAfter, queryId, receiver, user, startParam } = initData;

    return JSON.stringify({
      authDate,
      chat,
      hash,
      canSendAfter,
      queryId,
      receiver,
      user,
      startParam,
    }, null, ' ');
  }, [initData]);

  return (
    <div>
      <h3>Welcome, {initData?.user?.firstName} {initData?.user?.lastName}</h3>
      <pre>
        <code>
          {initDataJson}
        </code>
      </pre>
    </div>
  );
}



export default function Home() {
  return (
    <>
      <MainButtonTest/>
      <GameNoSSR/>
      <InitData/>
    </>
  );
}
