import { HOME } from './routes'
import { QueryParams } from '../types/app'

export interface UpdateQueryParamsAction {
  type: typeof HOME
  query: QueryParams
  replaceQuery?: boolean
  meta?: {
    location: {
      kind: string
    }
  }
}

export function updateQueryParams(query: QueryParams): UpdateQueryParamsAction {
  return { type: HOME, query }
}
