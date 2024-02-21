// Providers.js
'use client';
import { Provider } from "react-redux";
import store from "../lib/redux/store";
import type {ReactNode} from "react";

export function AppStoreProvider({ children }: {children: ReactNode}) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
