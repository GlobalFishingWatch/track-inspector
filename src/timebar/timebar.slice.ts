import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type TimebarSlice = {
  highlightedTime: {
    start: string
    end: string
  } | null
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
  },
})

export const { setHighlightedTime, disableHighlightedTime } = slice.actions
export default slice.reducer
