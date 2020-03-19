import { createAction } from 'typesafe-actions'
import { FeatureCollection } from 'geojson'

export const setVesselTrack = createAction('SET_VESSEL_TRACK')<{
  id: string
  data: any
}>()

export const setVesselEvents = createAction('SET_VESSEL_EVENTS')<{
  id: string
  data: FeatureCollection
}>()
