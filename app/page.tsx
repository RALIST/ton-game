'use client';
import {useInitData, useMiniApp, useViewport} from "@tma.js/sdk-react";
import {useEffect, useState} from "react";
import {upsertUser} from "@/app/actions";
import MainMenu from "@/components/MainMenu";

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
  const app = useMiniApp();

  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    if (!viewport.isExpanded){
      viewport.expand();
    }

    upsertUser(initData?.user).then((r) => {
        setUser(r)
        app.ready();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <MainMenu user={user}/>
};
