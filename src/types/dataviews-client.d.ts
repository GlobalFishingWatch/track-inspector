export interface Endpoint {
  type: string,
  urlTemplate: string
}

export interface Dataset {
  endpoints?: Endpoint[]
}

export interface Dataview {
  id: string
  config?: any,
  datasets?: Dataset[]
}

export interface DataviewWorkspace {
  id: string,
  overrides?: any
  dataview?: Dataview
}

export interface Workspace {
  zoom: number,
  latitude: number,
  longitude: number,
  dataviewsWorkspace?: DataviewWorkspace[]
}