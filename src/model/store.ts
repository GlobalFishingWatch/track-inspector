import { applyMiddleware, combineReducers, createStore, Middleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRoutes, Options } from 'redux-first-router'
import qs from 'qs'
import routesMap from './routes'

const routesOptions: Options = {
  querySerializer: {
    // TODO toNumber
    // TODO remove latlon decimals
    stringify: (object: object) => qs.stringify(object, { encode: false }),
    parse: (string: string) => qs.parse(string, { arrayLimit: 300 }),
  },
}


const { reducer, middleware, enhancer } = connectRoutes(routesMap, routesOptions)
export const rootReducer = combineReducers({ location: reducer })

const middlewares = applyMiddleware(middleware)
const enhancers = composeWithDevTools(enhancer, middlewares)
const store = createStore(rootReducer, {}, enhancers)

export default store
