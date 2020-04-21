import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import connectedRoutes, { routerQueryMiddleware } from './routes'
import timebar from './timebar/timebar.slice'
import loaders from './loaders/loaders.slice'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  timebar,
  loaders,
  location: location,
})

export type RootState = ReturnType<typeof rootReducer>

export default () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(), routerQueryMiddleware, routerMiddleware],
    enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers],
  })
  // initialDispatch()
  return store
}
