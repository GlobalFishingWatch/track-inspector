import { createAction } from 'typesafe-actions'

export const setVesselTrack = createAction('SET_VESSEL_TRACK')<{
  id: string
  data: any
}>()