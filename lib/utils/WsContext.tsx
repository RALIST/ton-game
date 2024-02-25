import {createContext} from "react";

export const ws = new WebSocket(`ws://localhost:3000/api/socket`)
export const WsContext = createContext(ws)
