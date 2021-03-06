import { Middleware, Dispatch } from 'redux'
import {
  NOT_FOUND,
  RoutesMap,
  redirect,
  connectRoutes,
  Options,
  StateGetter,
} from 'redux-first-router'
import qs from 'qs'
import { Dictionary } from 'types'
import { RootState } from 'store/store'
import { dataviewsThunk } from 'features/dataviews/dataviews.thunks'
import { UpdateQueryParamsAction } from './routes.actions'

export const HOME = 'HOME'

const preFetchThunks = [dataviewsThunk]

const thunk = async (dispatch: Dispatch<any>, getState: StateGetter<RootState>) => {
  preFetchThunks.forEach((thunk) => thunk(dispatch, getState))
}

const routesMap: RoutesMap = {
  [HOME]: {
    path: '/',
    thunk,
  },
  [NOT_FOUND]: {
    path: '',
    thunk: async (dispatch: Dispatch) => {
      dispatch(redirect({ type: HOME }))
    },
  },
}

const urlToObjectTransformation: Dictionary<(value: any) => any> = {
  latitude: (s) => parseFloat(s),
  longitude: (s) => parseFloat(s),
  zoom: (s) => parseFloat(s),
  sidebar: (s) => s === 'true',
  workspaceDataviews: (s) => {
    const layers = s.map((layer: any) => {
      const newLayer = { ...layer }
      if (layer.overrides) {
        if (layer.overrides.currentEvent) {
          layer.overrides.currentEvent = {
            position: {
              lat: parseFloat(layer.overrides.currentEvent.position.lat),
              lng: parseFloat(layer.overrides.currentEvent.position.lng),
            },
          }
        }
        if (layer.overrides.visible) {
          layer.overrides.visible = layer.overrides.visible === 'true'
        }
      }
      if (layer.view?.visible) {
        layer.view.visible = layer.view.visible === 'true'
      }
      return newLayer
    })
    return layers
  },
}

const encodeWorkspace = (object: Record<string, unknown>) => {
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
  basename: process.env.NODE_ENV === 'production' ? '/track-inspector' : '',
  querySerializer: {
    stringify: encodeWorkspace,
    parse: decodeWorkspace,
  },
  initialDispatch: false,
}

export const routerQueryMiddleware: Middleware = ({ getState }: { getState: () => RootState }) => (
  next: any
) => (action: UpdateQueryParamsAction) => {
  const routesActions = Object.keys(routesMap)
  // check if action type matches a route type
  const isRouterAction = routesActions.includes(action.type)
  if (!isRouterAction) {
    next(action)
  } else {
    const newAction: UpdateQueryParamsAction = { ...action }

    const prevQuery = getState().location.query || {}
    if (newAction.replaceQuery !== true) {
      newAction.query = {
        ...prevQuery,
        ...newAction.query,
      }
    }
    next(newAction)
  }
}

export default connectRoutes(routesMap, routesOptions)
