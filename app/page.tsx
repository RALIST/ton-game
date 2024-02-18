'use client';
import dynamic from "next/dynamic";
import {useInitData, useViewport} from "@tma.js/sdk-react";
import {useEffect} from "react";

import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const GameNoSSR = dynamic(
  () => import('@/components/Game'),
  { ssr: false }
);

function Init() {
    const viewport = useViewport();
    const initData = useInitData();

  useEffect(() => {
    if (!viewport.isExpanded){
      viewport.expand();
    }

    const userData = initData?.user
    const userId = userData?.id

    if (!userData) return;
    if (!userId) return;

    const user = prisma.user.upsert({
      create: {
        telegram_id: userId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username
      },
      update: {},
      where: { telegram_id: userId}
    })

    console.log(user)

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
}
