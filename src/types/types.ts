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

export type QueryParam = WorkspaceParam

export type QueryParams = {
  [query in QueryParam]?: string | number | null
}

export type LoaderArea = 'map' | 'timebar'

export type Loader = {
  id: string
  areas: LoaderArea[]
}
