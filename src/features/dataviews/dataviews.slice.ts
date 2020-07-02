import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { RootState } from 'store/store'

const initialState: { dataviews: Dataview[] } = { dataviews: [] }

const slice = createSlice({
  name: 'vessels',
  initialState,
  reducers: {
    setDataviews: (state, action: PayloadAction<Dataview[]>) => {
      state.dataviews = action.payload
    },
  },
})
export const { setDataviews } = slice.actions
export default slice.reducer
export const selectDataviews = (state: RootState) => state.dataviews.dataviews
