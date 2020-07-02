import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import difference from 'lodash/difference'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import DataviewsClient, { WorkspaceDataview, Dataview } from '@globalfishingwatch/dataviews-client'
import { TRACK_FIELDS, DEFAULT_DATAVIEWS } from 'config'
import { selectDataviewsQuery } from 'routes/routes.selectors'
import trackValueArrayToSegments from 'data-transform/trackValueArrayToSegments'
import { setDataviews } from './dataviews.slice'
import { addResources, completeLoading as completeResourceLoading } from './resources.slice'

const mockFetch = (url: string, init?: FetchOptions): Promise<Response> => {
  if (!url.match(/^\/dataviews/)) {
    return GFWAPI.fetch(url as string, init as any)
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        new Response(JSON.stringify(DEFAULT_DATAVIEWS), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    }, 1)
  })
}

const dataviewsClient = new DataviewsClient(/*GFWAPI.fetch*/ mockFetch)

export const dataviewsThunk = async (dispatch: Dispatch, getState: StateGetter<any>) => {
  const state = getState()
  const dataviewsQuery = selectDataviewsQuery(state)

  if (dataviewsQuery) {
    const workspaceIds = dataviewsQuery.map((d: WorkspaceDataview) => d.id)
    // TODO should take into account DVs thar are loadING
    const loadedDataviewsIds =
      state.dataviews.dataviews && state.dataviews.dataviews.map((d: Dataview) => d.id)
    const newDataviewsIds = difference(workspaceIds, loadedDataviewsIds) as number[]

    if (newDataviewsIds.length) {
      const newDataviews = await dataviewsClient.getDataviews(newDataviewsIds)
      // TODO this actually replaces, and should add
      dispatch(setDataviews(newDataviews))

      const { promises, resources } = await dataviewsClient.getResources(
        newDataviews,
        dataviewsQuery
      )

      dispatch(addResources(resources))

      promises.forEach((promise) => {
        promise.then((resource) => {
          if (resource.type === 'track') {
            resource.data = trackValueArrayToSegments(resource.data as number[], TRACK_FIELDS)
          }
          dispatch(completeResourceLoading(resource))
        })
      })
    }
  }
}
