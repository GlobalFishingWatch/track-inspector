export interface Dictionary<T> {
  [key: string]: T
}

export type WorkspaceParam = 
  | 'dataviewsWorkspace'
  | 'zoom'
  | 'latitude'
  | 'longitude'

export type QueryParam =
  | WorkspaceParam

export type QueryParams = {
  [query in QueryParam]?: string | number | null
}
