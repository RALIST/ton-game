'use client';
import dynamic from "next/dynamic";
import {useInitData, useMiniApp, useViewport} from "@tma.js/sdk-react";
import {useEffect} from "react";

const GameNoSSR = dynamic(
  () => import('@/components/Game'),
  { ssr: false }
);

function Init() {
    const viewport = useViewport();

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
}
