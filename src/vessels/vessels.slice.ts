import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeatureCollection } from 'geojson'
import { Dictionary } from 'types'
import { RootState } from 'store'

type VesselsSlice = {
  tracks: Dictionary<FeatureCollection>
  events: Dictionary<any>
}

const initialState: VesselsSlice = {
  tracks: {},
  events: {},
}

const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    setVesselTrack: (state, action: PayloadAction<{ id: string; data: FeatureCollection }>) => {
      state.tracks[action.payload.id] = action.payload.data
    },
    setVesselEvents: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.events[action.payload.id] = action.payload.data
    },
  },
})
export const { setVesselTrack, setVesselEvents } = slice.actions
export default slice.reducer

export const selectTracks = (state: RootState) => state.vessels.tracks
export const selectEvents = (state: RootState) => state.vessels.events
