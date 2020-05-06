import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { RootState } from 'store/store'

const initialState: DataviewWorkspace[] = []

const slice = createSlice({
  name: 'dataviews',
  initialState,
  reducers: {
    setDataviews: (state, action: PayloadAction<DataviewWorkspace[]>) => {
      action.payload.forEach((dataviewWorkspace: DataviewWorkspace) => {
        // inject workspaceDV id in config for convenience
        const newDataviewWorkspace = { ...dataviewWorkspace }
        if (newDataviewWorkspace.dataview) {
          newDataviewWorkspace.dataview.config.id = newDataviewWorkspace.id
          newDataviewWorkspace.dataview.config.datasetParamsId = dataviewWorkspace.datasetParams.id
        }
        state.push(newDataviewWorkspace)
      })
    },
    addDataviews: (state, action: PayloadAction<DataviewWorkspace[]>) => {
      // ...
    },
    removeDataviews: (state, action: PayloadAction<string[]>) => {
      // ...
    },
  },
})
export const { setDataviews, addDataviews, removeDataviews } = slice.actions
export default slice.reducer
export const selectDataviews = (state: RootState) => state.dataviews
