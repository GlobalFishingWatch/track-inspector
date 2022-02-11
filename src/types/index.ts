import { Workspace } from '@globalfishingwatch/dataviews-client'

export interface Dictionary<T> {
  [key: string]: T
}

export type LatLon = {
  latitude: number
  longitude: number
}

export type WorkspaceParam =
  | 'workspaceDataviews'
  | 'zoom'
  | 'latitude'
  | 'longitude'
  | 'start'
  | 'end'
  | 'bookmarkStart'
  | 'bookmarkEnd'
  | 'sidebar'
  | 'timebarMode'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
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
  id: string
  type: 'encounter' | 'port' | 'loitering'
  position: {
    lat: number
    lon: number
  }
  start: number
  end: number
  vessel: EventVessel
  encounter?: {
    authorizationStatus: 'authorized' | 'partially' | 'unmatched' | 'pending'
    vessel: EventVessel
  }
  port?: {
    name: string
  }
}

export type AppState = Workspace & {
  sidebar: boolean
  timebarMode: string
  bookmarkStart?: string
  bookmarkEnd?: string
}

export enum TimebarMode {
  events = 'events',
  encounters = 'encounters',
  speed = 'speed',
}
