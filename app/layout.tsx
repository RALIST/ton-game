"use client"

import {PropsWithChildren} from 'react';
import { Inter } from 'next/font/google';
import { TmaSDKLoader } from '@/components/TmaSDKLoader';
import {Analytics} from "@vercel/analytics/next";
import { WebSocketProvider } from '@/components/WebSocketContext';

import '../assets/global.css';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebSocketProvider>
          <div className={"app"}>
            {/*<TmaSDKLoader>*/}
              {children}
            {/*</TmaSDKLoader>*/}
          </div>
        </WebSocketProvider>
        <Analytics/>
      </body>
    </html>
  );
}
