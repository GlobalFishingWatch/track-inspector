import { combineReducers } from 'redux'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import connectedRoutes, { routerQueryMiddleware } from 'routes/routes'
import timebar from 'features/timebar/timebar.slice'
import loaders from 'features/loaders/loaders.slice'
import vessels from 'features/vessels/vessels.slice'
import rulers from 'features/rulers/rulers.slice'
import map from 'features/map/map.reducer'

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
