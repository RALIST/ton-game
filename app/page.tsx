'use client';
import dynamic from "next/dynamic";
import {useInitData, useViewport} from "@tma.js/sdk-react";
import {useEffect} from "react";

const GameNoSSR = dynamic(
  () => import('@/components/Game'),
  { ssr: false }
);

function Init() {
    const init = useInitData();
    const viewport = useViewport();

  useEffect(() => {
    viewport.expand();
  }, []);

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
