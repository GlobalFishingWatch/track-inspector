import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRoutes, Options } from 'redux-first-router'
import qs from 'qs'
import routesMap from './routes'
import reducers from './reducers'
import { Dictionary } from '../types/types'

const urlToObjectTransformation: Dictionary<(value: any) => any> = {
  latitude: (s) => parseFloat(s),
  longitude: (s) => parseFloat(s),
  zoom: (s) => parseFloat(s),
  dataviewsWorkspace: (s) => {
    console.log(s)
    const layers = s.map((layer: any) => {
      const newLayer = { ...layer }
      if (layer.overrides?.currentEvent) {
        layer.overrides.currentEvent = {
          position: {
            lat: parseFloat(layer.overrides.currentEvent.position.lat),
            lng: parseFloat(layer.overrides.currentEvent.position.lng),
          },
        }
      }
      return newLayer
    })
    return layers
  },
}

const encodeWorkspace = (object: object) => {
  return qs.stringify(object, { encode: false })
}

const decodeWorkspace = (queryString: string) => {
  const parsed = qs.parse(queryString, { arrayLimit: 300 })

  Object.keys(parsed).forEach((param: string) => {
    const value = parsed[param]
    if (value && urlToObjectTransformation[param]) {
      parsed[param] = urlToObjectTransformation[param](value)
    }
  })
  return parsed
}

const routesOptions: Options = {
  querySerializer: {
    stringify: encodeWorkspace,
    parse: decodeWorkspace,
  },
}

const routerQueryMiddleware: Middleware = ({ getState }) => (next) => (action: any) => {
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
