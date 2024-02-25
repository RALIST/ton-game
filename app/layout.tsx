"use client"

import {PropsWithChildren} from 'react';
import { Inter } from 'next/font/google';
import { TmaSDKLoader } from '@/components/TmaSDKLoader';
import {Analytics} from "@vercel/analytics/next";
import {AppStoreProvider} from "@/components/AppStoreProvider";
import { ws, WsContext} from "@/lib/utils/WsContext";

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
