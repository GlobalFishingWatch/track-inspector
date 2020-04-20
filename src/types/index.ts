export interface Dictionary<T> {
  [key: string]: T
}

export type WorkspaceParam =
  | 'dataviewsWorkspace'
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | null
}

export type LoaderArea = 'map' | 'timebar'

export type Loader = {
  id: string
  areas: LoaderArea[]
}

export type EventVessel = {
  id: string
  name?: string
}

export type Event = {
  type: 'encounter' | 'port' | 'loitering'
  position: {
    lat: number
    lon: number
  }
  start: number
  end: number
  vessel: EventVessel
  encounter?: {
    authorizationStatus: 'authorized' | 'partially' | 'unmatched'
    vessel: EventVessel
  }
  port?: {
    name: string
  }
}

