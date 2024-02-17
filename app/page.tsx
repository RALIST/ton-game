'use client';
import dynamic from "next/dynamic";
import {useInitData, useMiniApp, useViewport} from "@tma.js/sdk-react";
import {useEffect} from "react";

const GameNoSSR = dynamic(
  () => import('@/components/Game'),
  { ssr: false }
);

function Init() {
    const init = useInitData();
    const viewport = useViewport();
    const app = useMiniApp();

  useEffect(() => {
    if (!viewport.isExpanded){
      viewport.expand();
    }
    app.setBackgroundColor("#000000");

  }, [app, viewport]);

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
