import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FeatureCollection } from 'geojson'
import { Dictionary } from 'types'
import { RootState } from 'store/store'

export type Vessel = {
  id: string
  name: string
}

type VesselsSlice = {
  vessels: Dictionary<Vessel>
  tracks: Dictionary<FeatureCollection>
  events: Dictionary<any>
}

const initialState: VesselsSlice = {
  vessels: {},
  tracks: {},
  events: {},
}

const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    setVessel: (state, action: PayloadAction<Vessel>) => {
      state.vessels[action.payload.id] = action.payload
    },
    setVesselTrack: (state, action: PayloadAction<{ id: string; data: FeatureCollection }>) => {
      state.tracks[action.payload.id] = action.payload.data
    },
    setVesselEvents: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.events[action.payload.id] = action.payload.data
    },
  },
})
export const { setVessel, setVesselTrack, setVesselEvents } = slice.actions
export default slice.reducer

export const selectVessels = (state: RootState) => state.vessels.vessels
export const selectTracks = (state: RootState) => state.vessels.tracks
export const selectEvents = (state: RootState) => state.vessels.events
