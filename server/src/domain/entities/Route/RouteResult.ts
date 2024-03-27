import GameObject from "@/src/domain/entities/GameObject/GameObject";

export enum RouteResultStatus {
  STARTED,
  INPROGRESS,
  COMPLETED
}

interface Location {
  id: number
  name: string
  description: string
  logs: string[]
  completed: boolean
}

// handles specific route progress
export default class RouteResult extends GameObject {
  locations: Location[]
  status: RouteResultStatus
  currentLocationId: number
  readonly maxLocationsCount: number = 10

  constructor() {
    super()
    this.status = RouteResultStatus.STARTED
    this.locations = this.generateLocations()
    this.currentLocationId = 0
  }

  generateLocations(): Location[] {
    const locations = []

    for(let i= 1; i <= this.maxLocationsCount; i++) {
      locations.push({
        id: i,
        name: `Location ${i}`,
        description: `Location ${i} description`,
        logs: [],
        completed: false
      })
    }

    return locations
  }
}
