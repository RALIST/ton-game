'use client';

import type { PropsWithChildren } from 'react';
import { SDKProvider, DisplayGate } from '@tma.js/sdk-react';
import React from 'react';

function SDKProviderError() {
  return (
    <div>
      Game is working only as Telegram Mini APP.
      <p>
        Visit <a href={"https://t.me/bs_girl_bot"}>Official bot</a> to launch game.
      </p>
    </div>
  );
}

function SDKProviderLoading() {
  return <div>SDK is loading.</div>;
}

function SDKInitialState() {
  return <div>Waiting for initialization to start.</div>;
}

/**
 * Root component of the whole project.
 */
export function TmaSDKLoader({ children }: PropsWithChildren) {
  return (
    <SDKProvider options={{ cssVars: true, acceptCustomStyles: true, async: true }}>
      <DisplayGate
        error={SDKProviderError}
        loading={SDKProviderLoading}
        initial={SDKInitialState}
      >
        {children}
      </DisplayGate>
    </SDKProvider>
  );
}
