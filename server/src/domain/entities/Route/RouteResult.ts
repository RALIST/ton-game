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
export default class RouteResult {
  locations: Location[]
  status: RouteResultStatus
  readonly maxLocationsCount: number = 10

  constructor() {
    this.status = RouteResultStatus.STARTED
    this.locations = this.generateLocations()
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
