import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI from '@globalfishingwatch/api-client'
import { TYPES } from "@globalfishingwatch/layer-composer";
import { mockFetches } from '../constants'
import { DataviewWorkspace, Dataview } from '../types/dataviews-client'
import { getDataviewsQuery } from './route.selectors'
import { updateMapLayers } from './map.actions'

const mockFetch = (mockFetchId: string) => {
  return new Promise((resolve) => {
    setInterval(() => {
      const mock = mockFetches[mockFetchId]
      resolve(mock)
    }, 2000)
  })
}

// TODO move to layerComposer
const DATASETLESS_GENERATOR_TYPES = [TYPES.BACKGROUND, TYPES.BASEMAP, TYPES.GL]

interface DataviewClientLoader extends DataviewWorkspace {
  loading?: boolean,
}

class DataviewsClient {
  _dataviews = new Map<string, DataviewClientLoader>()
  _library = new Map<string, DataviewWorkspace>()

  constructor(api:any, library?:DataviewWorkspace[]) {
    // TODO store GFWAPI and use it for real fetches
    if (library) {
      this._library = new Map<string, DataviewWorkspace>(
        library.map(dataview => [dataview.id, dataview])
      )
    }
  }
  get loading() {
    for (let value of this._dataviews.values()) {
      if (value.loading) return true
    }
    return false
  }



  // Loads data for all current and visble dataviews
  // Returns an array of promises, depending on
  // - dv loading status (cant load data on a unresolved dv)
  // - dv visibility
  // - dv endpoints vs a whitelist of downloadable endpoints (ie tracks, info, but not tiles)
  loadData() {
    // for each existing dataview
  }

  // Loads dataview/dataset info
  // Returns null if nothing changed
  // Else returns a promise that returns an array of resolved dataviews
  load(inputDataviews_:string|any[]): null | Promise<any> {
    // transform string dvs if needed
    // 
    // for each existing dataview
    //    if dataview not anymore in input dataviews
    //      remove from existing dataviews, mark dvs as changed
    //
    // for each input dataview
    //    if dvs was already existing
    //      check delta with previous overrides, if delta is true:
    //        mark dvs as changed
    //        update dv overrides / aka merge dv config with overrides
    //    else 
    //      if exist in defaultDataviewsLibrary, loading: false and use config
    //      else 
    //        if dv not currently loading
    //           add to to-be-loaded endpoints
    //
    // check changed state of each DV 
    //    if nothing has to be loaded AND nothing has changed, return null
    //       thunk will need to not dispatch an action
    //    if nothing has to be loaded, resolve promise instantly with resolved dvs
    let inputDataviews:any[] = inputDataviews_ as any[]
    if (!Array.isArray(inputDataviews_)) {
      try {
        inputDataviews = JSON.parse(inputDataviews_ as string)
      } catch (e) {
        console.error('Could not parse URL workspace')
      }
    }

    const inputDataviewsDict = new Map<string, DataviewWorkspace>(
      inputDataviews.map(inputDataview => [inputDataview.id, inputDataview])
    )

    let hasUpdates = false
    const loadDataviewsForIds:string[] = []
    const loadDatasetsForIds:string[] = []

    this._dataviews.forEach( (dataview, id) => {
      if (!inputDataviewsDict.has(id)) {
        hasUpdates = true
        this._dataviews.delete(id)
      }
    })

    inputDataviewsDict.forEach( (inputDataview, id) => {
      if (this._dataviews.has(id)) {
        // const overrides = getOverrideUpdates(this._dataviews.get(id)?.overrides, inputDataview.overrides)
        // if (overrides) {
        //   this._dataviews.get(id)!.overrides = overrides
        //   hasUpdates = true
        // }
      } else {
        hasUpdates = true
        let libraryParams = {}
        if (this._library.has(id)) {
          libraryParams = { ...this._library.get(id) }
        }
        const newDataview:DataviewClientLoader = {
          ...inputDataview,
          ...libraryParams
        }

        newDataview.loading = false

        // no config -> load whole dataview
        if (!newDataview.dataview?.config) {
          loadDataviewsForIds.push(id)
          newDataview.loading = true
        // no dataset --> only load dataset
        } else if (
          !newDataview.dataview?.datasets &&
          !DATASETLESS_GENERATOR_TYPES.includes(newDataview.dataview.config.type)
        ) {
          loadDatasetsForIds.push(id)
          newDataview.loading = true
        }

        // TODO uniq loadDatasetsForIds

        this._dataviews.set(id, newDataview)
      }
    })

    if (!hasUpdates) return null

    const promises = []

    if (loadDataviewsForIds.length) {
      const dataviewsUrl = `dataviews?ids${loadDataviewsForIds.join(',')}`
      console.log(dataviewsUrl)
      const fetchDataviews = mockFetch(dataviewsUrl)
        .then(data => {
          console.log('data from /dataviews')
          // TODO hydrate this._dataviews + use overrides for dataviews (visual stuff)
        })
      promises.push(fetchDataviews)
    }

    if (loadDatasetsForIds.length) {
      const datasetsUrl = `datasets?ids${loadDatasetsForIds.join(',')}`
      console.log(datasetsUrl)
      const fetchdatasets = mockFetch(`datasets?ids${loadDatasetsForIds.join(',')}`)
        .then(data => {
          console.log('data from /datasets')
          // TODO hydrate this._dataviews + use overrides for datasets (such as id etc)
        })
        promises.push(fetchdatasets)
    }
    
    return Promise.all(promises)
      .then(() => {
        const resolvedDataviews: Dataview[] = Array.from(this._dataviews).map(item => item[1].dataview as Dataview)
        return resolvedDataviews
      })
  }
}

const dataviewsClient = new DataviewsClient(GFWAPI)

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = getDataviewsQuery(state)
  if (dataviewsQuery) {
    console.log('dataviews query:', dataviewsQuery)
    const dataviews = await dataviewsClient.load(dataviewsQuery)
    console.log(dataviews)
    if (dataviews === null) {
      console.log('no updates, dont trigger any action')
    } else {
      console.log('received this from dataviews-client:', dataviews)
      // TODO fetch data when/if needed

      // update layer composer
      const generatorConfigs = dataviews.map((dataview: Dataview) => dataview.config)
      dispatch(updateMapLayers(generatorConfigs))
    }
  }
}