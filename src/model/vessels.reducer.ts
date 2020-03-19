import { createReducer } from 'typesafe-actions'
import { setVesselTrack, setVesselEvents } from './vessels.actions'
import { Dictionary } from '../types/types'
import { FeatureCollection } from 'geojson'

interface VesselsReducer {
  tracks: Dictionary<any>
  events: Dictionary<FeatureCollection>
}
const initialState: VesselsReducer = {
  tracks: {},
  events: {},
}

export default createReducer(initialState)
  .handleAction(setVesselTrack, (state: any, action: any) => {
    const tracks = { ...state.tracks }
    tracks[action.payload.id] = action.payload.data
    return { ...state, tracks }
  })
  .handleAction(setVesselEvents, (state: any, action: any) => {
    const events = { ...state.events }
    events[action.payload.id] = action.payload.data
    return { ...state, events }
  })
