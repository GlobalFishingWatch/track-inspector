export interface QueryParams {
  [query: QueryParam]: string | number | array | null
}

export type WorkspaceParam = 
  | 'dataviewsWorkspace'
  | 'zoom'
  | 'latitude'
  | 'longitude'

export type QueryParam =
  | WorkspaceParam
