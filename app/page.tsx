'use client';

import { useEffect, useMemo, useState } from 'react';
import {useBackButton, useInitData, useMainButton, useViewport} from '@tma.js/sdk-react';
import Phaser from 'phaser';

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

function Game() {
  class Example extends Phaser.Scene
  {
    preload ()
    {
      this.load.setBaseURL('https://labs.phaser.io');

      this.load.image('sky', 'assets/skies/space3.png');
      this.load.image('logo', 'assets/sprites/phaser3-logo.png');
      this.load.image('red', 'assets/particles/red.png');
    }

    create ()
    {
      this.add.image(400, 300, 'sky');

      const particles = this.add.particles(0, 0, 'red', {
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
      });

      const logo = this.physics.add.image(400, 100, 'logo');

      logo.setVelocity(100, 200);
      logo.setBounce(1, 1);
      logo.setCollideWorldBounds(true);

      particles.startFollow(logo);
    }
  }

  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: Example,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    }
  };

  const game = new Phaser.Game(config);

  return null;
}

export default function Home() {
  return (
    <>
      <MainButtonTest/>
      <Game/>
      <InitData/>
    </>
  );
}
