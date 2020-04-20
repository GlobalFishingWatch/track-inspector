import { combineReducers } from 'redux'
import todosReducer from './todos/todos.slice'
// import visibilityFilterReducer from './filters/filtersSlice'

const rootReducer = combineReducers({
  todos: todosReducer,
  // visibilityFilter: visibilityFilterReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
