import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dictionary } from 'types'
import { RootState } from 'store/store'
import { Segment } from 'data-transform/trackValueArrayToSegments'

export type VesselDynamicField = {
  start: string
  end: string
  value: string
}

export type Vessel = {
  id: string
  name: string
  imo?: string
  flags?: VesselDynamicField[]
  lastFlag?: string
  mmsi?: VesselDynamicField[]
  lastMMSI?: string
}

type VesselsSlice = {
  vessels: Dictionary<Vessel>
  tracks: Dictionary<Segment[]>
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
      console.log(action.payload)
      const vessel = action.payload
      if (vessel.mmsi) {
        vessel.mmsi.sort((a, b) => {
          return new Date(b.end).getTime() - new Date(a.end).getTime()
        })
        vessel.lastMMSI = vessel.mmsi[0].value
      }
      if (vessel.flags) {
        vessel.flags.sort((a, b) => {
          return new Date(b.end).getTime() - new Date(a.end).getTime()
        })
        vessel.lastFlag = vessel.flags[0].value
      }
      state.vessels[action.payload.id] = action.payload
    },
    setVesselTrack: (state, action: PayloadAction<{ id: string; data: Segment[] }>) => {
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
