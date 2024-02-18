'use client';

import dynamic from "next/dynamic";
import {useInitData, useViewport} from "@tma.js/sdk-react";
import {useEffect} from "react";
import {upsertUser} from "@/app/actions";

const GameNoSSR = dynamic(
  () => import('@/components/Game'),
  { ssr: false }
);

async function Init() {
  const viewport = useViewport();
  const initData = useInitData();
  const userData = initData?.user
  const userId = userData?.id

  const user = await upsertUser(initData?.user)

  useEffect(() => {
    if (!viewport.isExpanded){
      viewport.expand();
    }
  }, [viewport]);

  return null;
}

export default function Home() {
  return (
    <>
      <Init/>
      <GameNoSSR/>
    </>
  );
};
