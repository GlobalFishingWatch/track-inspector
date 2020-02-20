import { createReducer } from 'typesafe-actions'
import { setVesselTrack } from './vessels.actions'
import { Dictionary } from '../types/types'

interface VesselsReducer {
  tracks: Dictionary<any>
}
const initialState: VesselsReducer = {
  tracks: {}
}

export default createReducer(initialState)
  .handleAction(setVesselTrack, (state: any, action:any) => {
    const tracks = {...state.tracks }
    tracks[action.payload.id] = action.payload.data
    return { ...state, tracks }
  })