'use client';

import dynamic from "next/dynamic";
import {useInitData, useViewport} from "@tma.js/sdk-react";
import {useEffect, useState} from "react";
import {upsertUser} from "@/app/actions";

const GameNoSSR = dynamic(
  () => import('@/components/Game'),
  { ssr: false }
);

export type AppUser = {
  id: bigint,
  telegramId: bigint,
  firstName: string | null,
  lastName: string | null,
  username: string | null,
  createdAt: Date,
  updatedAt: Date
}

export default function Home() {
  const viewport = useViewport();
  const initData = useInitData();

  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    if (!viewport.isExpanded){
      viewport.expand();
    }

    upsertUser(initData?.user).then(r => setUser(r))
  }, [initData?.user, viewport]);

  return (
    <>
      <GameNoSSR/>
    </>
  );
};
