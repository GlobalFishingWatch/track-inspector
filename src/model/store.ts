import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRoutes, Options } from 'redux-first-router'
import qs from 'qs'
import routesMap from './routes'
import reducers from './reducers'
import { Dictionary } from '../types/types'

const urlToObjectTransformation: Dictionary<(value: string) => any> = {
  latitude: (s) => parseFloat(s),
  longitude: (s) => parseFloat(s),
  zoom: (s) => parseFloat(s),
}

const decodeWorkspace = (queryString: string) => {
  const parsedUrl = qs.parse(queryString, { arrayLimit: 300 })
  const workspace:Dictionary<any> = {}
  ;(['zoom', 'latitude', 'longitude'] as string[]).forEach((param: string) => {
    const value = parsedUrl[param]
    if (value) {
      workspace[param] = urlToObjectTransformation[param](value)
    }
  })
  return workspace
}

const routesOptions: Options = {
  querySerializer: {
    stringify: (object: object) => qs.stringify(object, { encode: false }),
    parse: decodeWorkspace,
  },
}

const routerQueryMiddleware: Middleware = ({ getState }) => (next) => (
  action: any
) => {
  const routesActions = Object.keys(routesMap)
  // check if action type matches a route type
  const isRouterAction = routesActions.includes(action.type)
  if (!isRouterAction) {
    next(action)
  }

  const newAction: any = { ...action }

  const prevQuery = getState().location.query || {}
  if (newAction.replaceQuery !== true) {
    newAction.query = {
      ...prevQuery,
      ...newAction.query,
    }
  }

  next(newAction)
}


const { reducer, middleware, enhancer } = connectRoutes(routesMap, routesOptions)
export const rootReducer = combineReducers({ ...reducers, location: reducer })

const middlewares = applyMiddleware(routerQueryMiddleware, middleware)
const enhancers = composeWithDevTools(enhancer, middlewares)
const store = createStore(rootReducer, {}, enhancers)

export default store
