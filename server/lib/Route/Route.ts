import GameObject from "@/lib/GameObject/GameObject";

interface Routes {
  [key: number]: Route
}

export const gRoutes: Routes = {}

export default class Route extends GameObject {
  public static async initialize() {
    console.log("Routes initialize")
    gRoutes[0] = new Route()
  }
}
