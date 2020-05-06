import { Dataview } from '@globalfishingwatch/api-client'
import { HOME } from 'routes/routes'

export const ADD_DATAVIEWS = 'ADD_DATAVIEWS'
export const REMOVE_DATAVIEWS = 'REMOVE_DATAVIEWS'

export const addDataviews = (dataviews: Dataview[]) => {
  return { type: ADD_DATAVIEWS, payload: dataviews }
}

export const removeDataviews = (dataviewsIds: string[]) => {
  return { type: REMOVE_DATAVIEWS, payload: dataviewsIds }
}
