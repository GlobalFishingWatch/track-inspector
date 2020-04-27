import { HOME } from '.'
import { QueryParams } from '../types'

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
