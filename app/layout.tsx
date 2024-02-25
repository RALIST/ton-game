"use client"

import {createContext, PropsWithChildren} from 'react';
import { Inter } from 'next/font/google';
import { TmaSDKLoader } from '@/components/TmaSDKLoader';
import {Analytics} from "@vercel/analytics/next";
import {AppStoreProvider} from "@/components/AppStoreProvider";

import '../assets/global.css';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppStoreProvider>
          <WsContext.Provider value={ws}>
            <div className={"app"}>
              <TmaSDKLoader>
                {children}
              </TmaSDKLoader>
            </div>
          </WsContext.Provider>
        </AppStoreProvider>
        <Analytics/>
      </body>
    </html>
  );
}

const ws = new WebSocket(`ws://localhost:3000/api/socket`)
const WsContext = createContext(ws)
export { WsContext }
