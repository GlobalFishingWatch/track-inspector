import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Resource } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'
import { Vessel } from 'features/vessels/vessels.selectors'

export interface AppResource extends Resource {
  loaded?: boolean
}

const initialState: { resources: AppResource[] } = {
  resources: [],
}

const slice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResources: (state, action: PayloadAction<Resource[]>) => {
      action.payload.forEach((resource) => {
        const existingResourceIndex = state.resources.findIndex(
          (r) => r.resolvedUrl === resource.resolvedUrl
        )
        if (existingResourceIndex === -1) {
          state.resources.push(resource)
        } else {
          state.resources = [
            ...state.resources.slice(0, existingResourceIndex),
            resource,
            ...state.resources.slice(existingResourceIndex + 1),
          ]
        }
      })
    },
    completeLoading: (state, action: PayloadAction<Resource>) => {
      const resource = state.resources.find(
        (resource) => resource.resolvedUrl === action.payload.resolvedUrl
      )
      if (resource) {
        resource.data = action.payload.data
        resource.loaded = true

        if (resource.type === 'info') {
          const vessel = resource.data as Vessel
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
          resource.data = vessel
        }
      }
    },
  },
})
export const { addResources, completeLoading } = slice.actions
export default slice.reducer
export const selectResources = (state: RootState) => state.resources.resources
