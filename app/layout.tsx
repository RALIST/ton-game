import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Inter } from 'next/font/google';
import { TmaSDKLoader } from '@/components/TmaSDKLoader';
import {Analytics} from "@vercel/analytics/next";
import '../assets/global.css';
import {AppStoreProvider} from "@/components/AppStoreProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {/* eslint-disable-next-line react/jsx-no-undef */}
        <AppStoreProvider>
          <div className={"app"}>
            {children}
            {/*<TmaSDKLoader>*/}
            {/*  */}
            {/*</TmaSDKLoader>*/}
          </div>
        </AppStoreProvider>
        <Analytics/>
      </body>
    </html>
  );
}
