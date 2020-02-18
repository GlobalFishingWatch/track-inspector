import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import { getDataviewsQuery } from './route.selectors'
import GFWAPI from '@globalfishingwatch/api-client'


interface Dataview {}

interface DataviewClientLoader {
  loading: boolean,
  dataLoading: boolean,
  dataview?: Dataview
}

class DataviewsClient {
  
  constructor(api:any) {
    // TODO store GFWAPI and use it for real fetches
  }
  get loading() {
    for (let value of this._dataviews.values()) {
      if (value.loading) return true
    }
    return false
  }

  _dataviews = new Map<string, DataviewClientLoader>()

  load(dataviews:string|any[]): null | Promise<any> {
    let resolvedDataviews:[any] = dataviews as [any]
    if (!Array.isArray(dataviews)) {
      try {
        resolvedDataviews = JSON.parse(dataviews as string)
      } catch (e) {
        console.error('Could not parse URL workspace')
      }
    }

    // if any of dataviews have ids, load all dataviews + datasets from dataviews endpoint
    // if any of dataviews already have configs, load all datasets from datasets endpoint
    const dataviewsIdsToLoad: string[] = []
    resolvedDataviews.forEach(dataview => {
      const id:string = dataview.id
      if (this._dataviews.has(id)) {

      } else {
        this._dataviews.set(id, {
          loading: true,
          dataLoading: false
        })
        dataviewsIdsToLoad.push(id)
      }
    })

    // No dataviews to load, bail here but first look at load status, if any still loading return that info
    if (!dataviewsIdsToLoad.length) {
      return Promise.resolve(this._dataviews)
    }

    // TODO real fetch
    const mockFetch = new Promise((resolve) => {
      setInterval(() => {
        resolve({
          lala: 42
        })
      }, 2000)
    })

    const finalPromise = mockFetch.then(() => {
      dataviewsIdsToLoad.forEach(id => {
        this._dataviews.get(id)!.loading = false
        this._dataviews.get(id)!.dataview = {
          config: 'lol'
        }
      })
      return this._dataviews
    })

    return Promise.all([finalPromise])
  }
}

const dataviewsClient = new DataviewsClient(GFWAPI)

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = getDataviewsQuery(state)
  if (dataviewsQuery) {
    console.log(dataviewsQuery)
    const dataviews = await dataviewsClient.load(dataviewsQuery)
    console.log(dataviews)
    // if (dataviews.length)
  }
}