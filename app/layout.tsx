"use client"

import {PropsWithChildren} from 'react';
import { Inter } from 'next/font/google';
import { TmaSDKLoader } from '@/components/TmaSDKLoader';

import '../assets/global.css';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <div className={"app"}>
            <TmaSDKLoader>
              {children}
            </TmaSDKLoader>
          </div>
      </body>
    </html>
  );
}
