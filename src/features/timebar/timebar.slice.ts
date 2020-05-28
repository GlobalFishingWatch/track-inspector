import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from 'store/store'
import { Event } from 'types/'

type TimebarSlice = {
  highlightedTime: {
    start: string
    end: string
  } | null
  highlightedEvent?: Event
}

const initialState: TimebarSlice = {
  highlightedTime: null,
}

const slice = createSlice({
  name: 'timebar',
  initialState,
  reducers: {
    setHighlightedTime: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.highlightedTime = action.payload
    },
    disableHighlightedTime: (state) => {
      state.highlightedTime = null
    },
    setHighlightedEvent: (state, action: PayloadAction<Event>) => {
      state.highlightedEvent = action.payload
    },
  },
})

export const { setHighlightedTime, disableHighlightedTime, setHighlightedEvent } = slice.actions
export default slice.reducer

export const selectHighlightedTime = (state: RootState) => state.timebar.highlightedTime
export const selectHighlightedEvent = (state: RootState) => state.timebar.highlightedEvent
