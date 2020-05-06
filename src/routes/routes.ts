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
import { RootState } from 'store/store'
import { Dictionary } from 'types'
import { dataviewsThunk } from 'features/dataviews/dataviews.thunks'
import { UpdateQueryParamsAction } from './routes.actions'
import parseDeep from 'util/parseDeep'
// import { ADD_DATAVIEWS, REMOVE_DATAVIEWS } from 'features/dataviews/dataview.actions'
// import { DataviewWorkspace } from '@globalfishingwatch/api-client'

export const HOME = 'HOME'

const preFetchThunks = [dataviewsThunk]

const thunk = async (dispatch: Dispatch<any>, getState: StateGetter<any>) => {
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
  dataviewsWorkspace: (s) => parseDeep(s),
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
    // TODO use separated dataviews middleware BUT use prevQuery.dataviewsWorkspace as source of truth
    // console.log(action.subtype)
    // if (action.subtype) {
    //   const currentDataviewsWorkspace = (prevQuery.dataviewsWorkspace as unknown) as DataviewWorkspace[]
    //   switch (action.subtype) {
    //     case ADD_DATAVIEWS:
    //       console.log(currentDataviewsWorkspace)
    //       const newDataviewsWorkspace = [...currentDataviewsWorkspace, ...action.payload]
    //       newAction.query = { dataviewsWorkspace: (newDataviewsWorkspace as unknown) as string }
    //       break
    //   }
    // }
    // console.log(prevQuery, action)
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
