import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { RootState } from 'store/store'

const initialState: DataviewWorkspace[] = []

const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    setDataviews: (state, action: PayloadAction<DataviewWorkspace[]>) => {
      action.payload.forEach((dataviewWorkspace: DataviewWorkspace) =>
        state.push(dataviewWorkspace)
      )
    },
  },
})
export const { setDataviews } = slice.actions
export default slice.reducer
export const selectDataviews = (state: RootState) => state.dataviews
