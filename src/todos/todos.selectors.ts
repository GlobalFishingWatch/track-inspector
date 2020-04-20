import { RootState } from '../reducers'
// import { createSelector } from '@reduxjs/toolkit'

export const selectTodos = (state: RootState) => state.todos

// export const selectTodos_ = createSelector([selectTodos], (todos) => {
//   return todos
// })
