import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import connectedRoutes, { routerQueryMiddleware } from 'routes'
import timebar from 'timebar/timebar.slice'
import loaders from 'loaders/loaders.slice'
import vessels from 'vessels/vessels.slice'
import rulers from 'rulers/rulers.slice'
import map from 'map/map.reducer'

const {
  reducer: location,
  middleware: routerMiddleware,
  enhancer: routerEnhancer,
  // initialDispatch,
} = connectedRoutes

const rootReducer = combineReducers({
  timebar,
  loaders,
  vessels,
  rulers,
  map, // TODO: remove - should use dataviews in get params
  location: location,
})

export type RootState = ReturnType<typeof rootReducer>

// Can't type because GetDefaultMiddlewareOptions type is not exposed by RTK
const defaultMiddlewareOptions: any = {
  // Fix issue with Redux-first-router and RTK (https://stackoverflow.com/questions/59773345/react-toolkit-and-redux-first-router)
  serializableCheck: false,
  immutableCheck: {
    ignoredPaths: [
      // Too big to check for immutability:
      'vessels',
    ],
  },
}

export default () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      ...getDefaultMiddleware(defaultMiddlewareOptions),
      routerQueryMiddleware,
      routerMiddleware,
    ],
    enhancers: (defaultEnhancers) => [routerEnhancer, ...defaultEnhancers],
  })
  // initialDispatch()
  return store
}
